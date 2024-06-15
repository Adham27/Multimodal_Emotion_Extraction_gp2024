import uuid
import os
import shutil
from datetime import datetime
import cv2
import numpy as np
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource
from keras.models import load_model
from moviepy.editor import VideoFileClip
from fpdf import FPDF
from werkzeug.utils import secure_filename
from models.base_model import baseModel
from models.reports import Reports
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
import matplotlib.pyplot as plt

# Create a Namespace for user operations
application = Namespace('App', description='video analyze operation', path='/users')

def preprocess_image(img_path, img_size=224):
    try:
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        img = cv2.resize(img, (img_size, img_size))
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {e}")

def preprocess_video(video_path):
    try:
        temp_dir = 'ai/temp_frames'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        
        video_filename = os.path.basename(video_path)
        base_filename, _ = os.path.splitext(video_filename)
        
        result = {"frames": []}

        video = VideoFileClip(video_path)
        total_frames = int(video.duration * video.fps)
        max_frames = 10
        
        # Calculate the interval to extract frames
        frame_interval = max(1, total_frames // max_frames)
        frames_to_extract = range(0, total_frames, frame_interval)[:max_frames]

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        for i, frame_no in enumerate(frames_to_extract):
            frame_time = frame_no / video.fps
            frame = video.get_frame(frame_time)
          
            faces = face_cascade.detectMultiScale(frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            for j, (x, y, w, h) in enumerate(faces):
                face_img = frame[y:y+h, x:x+w]
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                face_filename = f"{base_filename}_frame{i}_User{j}_{timestamp}.jpeg"
                face_filepath = os.path.join(temp_dir, face_filename)
                cv2.imwrite(face_filepath, face_img)
                result["frames"].append(face_filename)

        video.close()

        if not result["frames"]:
            return {"error": "No faces detected in the video"}

        return result
    except Exception as e:
        raise RuntimeError(f"Error preprocessing video: {e}")

def process_data(preprocessed_data):
    # Dictionary to map the model's output to emotion labels
    labels = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]
    le = LabelEncoder()
    le.fit(labels)

    # Load the new model
    model_path = 'F:\\Expressify\\server\\ai\\models\\Image_model.h5'
    try:
        image_model = load_model(model_path)
        print("Model loaded successfully.")
    except FileNotFoundError as e:
        print("Model file not found:", e)
    except Exception as e:
        print("Error loading model:", e)

    if "error" in preprocessed_data:
        return preprocessed_data

    report = {"frames": [], "emotions": []}

    for frame_filename in preprocessed_data["frames"]:
        frame_path = os.path.join('ai/temp_frames', frame_filename)
        try:
            img_array = preprocess_image(frame_path)
            predictions = image_model.predict(img_array)
            emotion_index = np.argmax(predictions)
            emotion = labels[emotion_index]
            report["frames"].append(frame_filename)
            report["emotions"].append({"frame": frame_filename, "emotion": emotion, "image_path": frame_path})
        except Exception as e:
            report["frames"].append(frame_filename)
            report["emotions"].append({"frame": frame_filename, "emotion": "unknown", "image_path": "", "error": str(e)})
    
    return report

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'EXPRESSIFY', 0, 0, 'L')
   
        # Add a date
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, datetime.now().strftime('%d/%m/%Y'), 0, 1, 'R')
        # Title
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, 'Emotion Detection Report', 0, 1, 'C')
        self.ln(20)

def generate_report(report_data):
    try:
        # Generate a unique ID and report name
        id = str(uuid.uuid4())
        report_fields = {
            "id": id,
            "reportname": f"Report_{datetime.now().strftime('%Y-%m-%d-%H:%M:%S')}",
            "created_by": get_jwt_identity(),
            "created_at": datetime.now().isoformat(' ', 'seconds'),
            "pdf": ""  # Initially set to an empty string, will update after generating PDF
        }

        new_report_id = baseModel.insert(Reports, report_fields)
        new_report = baseModel.find_by_id(Reports, id)

        # Initialize the PDF
        pdf = PDF()
        pdf.add_page()

        emotions_list = []

        for emotion_data in report_data["emotions"]:
            frame_path = os.path.join('ai/temp_frames', emotion_data['frame'])
            if os.path.exists(frame_path):
                pdf.image(frame_path, x=10, y=pdf.get_y(), w=50)
                pdf.ln(60)
            # Extract date, frame number, and face number from the frame filename
            parts = emotion_data['frame'].split('_')
           
            face_number = parts[-2]  
            frame_number = parts[-3]  
            
            pdf.multi_cell(200, 10, txt=f"Frame: {frame_number}, {face_number}, Date: {new_report.created_at}, Emotion: {emotion_data['emotion']}")
            pdf.ln(10)
            emotions_list.append(emotion_data['emotion'])
            # Draw line separator
            pdf.set_draw_color(0, 0, 0)
            pdf.set_line_width(0.1)
            pdf.line(10, pdf.get_y(), 200, pdf.get_y())
            pdf.ln(10)

        # Calculate average emotion
        emotion_counts = {emotion: emotions_list.count(emotion) for emotion in set(emotions_list)}
        most_common_emotion = max(emotion_counts, key=emotion_counts.get)
        average_emotion = most_common_emotion  # Simplified approach for now

        # Add emotion analysis to the PDF
        pdf.multi_cell(0, 10, txt=f"According to the emotion from the report it seems that most faces emotion is {most_common_emotion} and the average is {average_emotion}")
        pdf.ln(10)
        
        # Generate pie chart
        plt.figure(figsize=(6, 6))
        plt.pie(emotion_counts.values(), labels=emotion_counts.keys(), autopct='%1.1f%%')
        plt.title("Emotion Distribution")
        pie_chart_path = os.path.join('uploads/pdf/', f"emotion_pie_chart_{id}.png")
        plt.savefig(pie_chart_path)
        plt.close()

        pdf.image(pie_chart_path, x=60, y=pdf.get_y(), w=100)
        pdf.ln(60)

        # Save the PDF
        pdf_output_path = os.path.join('uploads/pdf/', f"report_{new_report.id}.pdf")
        pdf.output(pdf_output_path)
        baseModel.update(Reports, id, {"pdf": pdf_output_path})
        # Return the report ID and path
        return new_report_id, pdf_output_path
    except Exception as e:
        raise RuntimeError(f"Error generating report: {e}")

def cleanup_temp_files():
    temp_dirs = ['ai/temp_video', 'ai/temp_frames', 'ai/temp_audio', 'ai/temp_text']
    for dir in temp_dirs:
        for filename in os.listdir(dir):
            file_path = os.path.join(dir, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f"Error during cleanup: {e}")

@application.route('/<string:user_id>/app/analyzeVideo')
class analyzeVideo(Resource):
    @jwt_required()
    def post(self, user_id):
        video_file = request.files.get('video')
        if not video_file:
            return jsonify({"error": "No video file provided"})

        video_path = os.path.join('ai/temp_video', secure_filename(video_file.filename))
        video_file.save(video_path)

        try:
            print(tf.__version__)
            preprocessed_data = preprocess_video(video_path)
            if "error" in preprocessed_data:
                return jsonify(preprocessed_data)

            report_data = process_data(preprocessed_data)
            report_id, pdf_path = generate_report(report_data)
        except (ValueError, RuntimeError) as e:
            return {"error": str(e)}, 400
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}, 400
        finally:
            try:
                cleanup_temp_files()
                os.remove(video_path)
            except Exception as cleanup_error:
                print(f"Error during cleanup: {cleanup_error}")

        return {"report_id": report_id, "pdf_path": pdf_path}, 200
