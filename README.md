# 40VNFoods - AI Vietnamese Cuisine Recognition

> Deep Learning system to recognize 40 traditional Vietnamese dishes using InceptionV3

![Vietnamese Food](https://img.shields.io/badge/Food-Vietnamese-red)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16+-orange)

## 🌐 Live Demo

**Try it now:** [https://40vnfoods.vercel.app](https://40vnfoods.vercel.app)

## Overview

Full-stack AI application to recognize and classify **40 traditional Vietnamese dishes** with bilingual information, helping preserve and promote Vietnamese culinary culture.

**Tech Stack:** React + Vite + Tailwind CSS | Flask + TensorFlow + InceptionV3

**Deployment:** Frontend on Vercel | Backend on Render

## Features

- AI food recognition with confidence scores
- Bilingual food library (Vietnamese - English)
- JWT authentication & personalized history
- Regional classification (North - Central - South)
- Responsive modern UI

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
python api.py  # Runs on http://localhost:5000

# Frontend
cd frontend
npm install
npm run dev    # Runs on http://localhost:5173
```

## 40 Dishes

**Northern:** Phở, Bún chả, Bánh cuốn, Chả cá...  
**Central:** Bún bò Huế, Bánh bèo, Cao lầu, Mì Quảng...  
**Southern:** Bánh xèo, Cơm tấm, Hủ tiếu, Bún mắm...

## API Endpoints

**Auth:** `POST /api/register` | `POST /api/login` | `POST /api/refresh`  
**Predict:** `POST /api/predict` - Upload image Get dish name + confidence  
**History:** `GET /api/history` | `DELETE /api/history/<id>`  
**Foods:** `GET /api/foods` | `GET /api/foods/<name>`

## Model Evaluation

Comprehensive model metrics and evaluation available. Run evaluation script:

```bash
cd backend
python model_evaluation.py
```

**Generated Files:**

- `Models/InceptionV3/metrics.json` - Full metrics (accuracy, precision, recall, F1)
- `Models/InceptionV3/confusion_matrix.png` - Visualization
- `Models/InceptionV3/classification_report.txt` - Detailed report

**Current Model Stats:**

- Total Parameters: 22.8M (12.2M trainable)
- Architecture: InceptionV3 with Transfer Learning
- Classes: 40 Vietnamese dishes

See [Model Evaluation Documentation](backend/MODEL_EVALUATION_README.md) for details.

## Screenshots

![Home](Images/Screenshot%202026-01-07%20131448.png)
![Search](Images/Screenshot%202026-01-07%20131502.png)
![Results](Images/Screenshot%202026-01-07%20131740.png)

## Authors & Contact

**Nguyen Thai Bao, Do Xuan Chien** - Developers

[Nguyenthaibao874@gmail.com](mailto:Nguyenthaibao874@gmail.com) | [GitHub](https://github.com/DoChien2024/40VNFoods) | +84 389 387 955

---

<div align="center">

**Made with in Vietnam** | _Preserving Vietnamese culinary culture_

</div>
