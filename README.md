# 40VNFoods - AI Vietnamese Cuisine Recognition

> Deep Learning system to recognize 40 traditional Vietnamese dishes using InceptionV3

![Vietnamese Food](https://img.shields.io/badge/Food-Vietnamese-red)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16+-orange)

## 🌐 Live Demo

**Try it now:** [https://40vnfoods.vercel.app](https://40vnfoods.vercel.app)

---

## 📖 Overview

Full-stack AI application to recognize and classify **40 traditional Vietnamese dishes** with bilingual support, helping preserve and promote Vietnamese culinary culture.

**Tech Stack**

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Flask + TensorFlow 2.16 + InceptionV3
- **Deployment:** Vercel (Frontend) + Render (Backend)

**Key Features**

- 🤖 AI-powered food recognition with confidence scores
- 🌏 Bilingual interface (Vietnamese/English)
- 🔐 JWT authentication & personalized history
- 📍 Regional classification (North/Central/South)
- 📱 Fully responsive modern UI

---

## 🚀 Quick Start

```bash
# Backend Setup
cd backend
pip install -r requirements.txt
python api.py  # http://localhost:5000

# Frontend Setup
cd frontend
npm install
npm run dev    # http://localhost:5173
```

---

## 🍜 40 Vietnamese Dishes

| Region         | Count | Examples                                        |
| -------------- | ----- | ----------------------------------------------- |
| **Northern**   | 8     | Phở, Bún chả, Bánh cuốn, Chả cá, Bánh chưng     |
| **Central**    | 6     | Bún bò Huế, Bánh bèo, Cao lầu, Mì Quảng         |
| **Southern**   | 14    | Bánh xèo, Cơm tấm, Hủ tiếu, Bún mắm, Bánh khọt  |
| **Nationwide** | 12    | Bánh mì, Nem rán, Phở cuốn, Bánh canh, Gà nướng |

---

## 📡 API Endpoints

| Category    | Endpoints                                                           |
| ----------- | ------------------------------------------------------------------- |
| **Auth**    | `POST /api/register` `POST /api/login` `POST /api/refresh`          |
| **Predict** | `POST /api/predict` - Upload image → Get dish info + confidence     |
| **History** | `GET /api/history` `DELETE /api/history` `DELETE /api/history/<id>` |
| **Foods**   | `GET /api/foods/search` `GET /api/food/<name>`                      |

---

## 🎯 Model Performance

| Metric       | Value                              |
| ------------ | ---------------------------------- |
| Architecture | InceptionV3 with Transfer Learning |
| Parameters   | 22.9M (12.2M trainable)            |
| Classes      | 40 Vietnamese dishes               |
| Input Size   | 299×299 RGB                        |
| Single Image | ~95ms (10.6 img/sec)               |
| Batch (8)    | 25.0 img/sec                       |

**Evaluation & Testing**

```bash

# Quick performance test
python backend/tests/quick_test.py

# Interactive demo
python backend/tests/demo_model.py
```

**Model Files:** `fine_tune_model_best.h5` | `class_mapping.json` | `metrics.json` | `demo_results.json`

---

## 📸 Screenshots

![Home](Images/Screenshot%202026-01-07%20131448.png)
![Search](Images/Screenshot%202026-01-07%20131502.png)
![Results](Images/Screenshot%202026-01-07%20131740.png)

---

## 👥 Authors & Contact

**Nguyen Thai Bao, Do Xuan Chien** - Developers

📧 [Nguyenthaibao874@gmail.com](mailto:Nguyenthaibao874@gmail.com) | 💻 [GitHub](https://github.com/DoChien2024/40VNFoods) | 📱 +84 389 387 955

---

<div align="center">

**Made with ❤️ in Vietnam** | _Preserving Vietnamese culinary culture_

</div>
