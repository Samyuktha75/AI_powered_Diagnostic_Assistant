import os
import cv2
import numpy as np
import time  
from skimage.feature import local_binary_pattern
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

train_dir = "train_set"
test_dir = "test_set"

def preprocess(image):
    resized = cv2.resize(image, (128, 128))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    return blurred


def extract_features(image):
    LBP_POINTS = 8
    LBP_RADIUS = 1
    lbp = local_binary_pattern(image, LBP_POINTS, LBP_RADIUS, method="uniform")
    hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, LBP_POINTS + 3), range=(0, LBP_POINTS + 2))
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7) 
    return hist


def load_dataset(directory):
    data = []
    labels = []
    label_map = {}
    label_index = 0
    
    for disease in os.listdir(directory):  
        disease_path = os.path.join(directory, disease)
        
        if os.path.isdir(disease_path):
            if disease not in label_map:
                label_map[disease] = label_index
                label_index += 1
            
            for img_name in os.listdir(disease_path):
                img_path = os.path.join(disease_path, img_name)
                image = cv2.imread(img_path)
                if image is not None:
                    processed_image = preprocess(image)
                    features = extract_features(processed_image)
                    data.append(features)
                    labels.append(label_map[disease]) 
    
    return np.array(data), np.array(labels), label_map


X_train, y_train, label_map = load_dataset(train_dir)
X_test, y_test, _ = load_dataset(test_dir)


classifier = RandomForestClassifier(random_state=42)
classifier.fit(X_train, y_train)


reverse_label_map = {v: k for k, v in label_map.items()}


def real_time_classification():
    cap = cv2.VideoCapture(0)  

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame from camera.")
            break

        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresholded = cv2.threshold(blurred, 50, 255, cv2.THRESH_BINARY_INV)

       
        contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
           
            largest_contour = max(contours, key=cv2.contourArea)

           
            x, y, w, h = cv2.boundingRect(largest_contour)
            roi = frame[y:y+h, x:x+w]  

            if w > 30 and h > 30: 
                processed_roi = preprocess(roi)
                features = extract_features(processed_roi).reshape(1, -1)
                prediction = classifier.predict(features)[0] 
                predicted_disease = reverse_label_map[prediction]

               
                print(f"Detected Skin Disease: {predicted_disease}")

               
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(frame, predicted_disease, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

               
                time.sleep(2)

       
        cv2.imshow("Skin Disease Detection", frame)

       
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


real_time_classification()
