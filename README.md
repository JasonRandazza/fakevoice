# 🎙️ FakeVoice AI

**FakeVoice AI** is a premium, ultra-low latency voice synthesis and cloning application. It allows you to transform text into lifelike speech using advanced AI models, featuring a stunning modern interface and real-time performance.

---

## 🚀 How it Started

This project was originally inspired by the [LearnWeb3.io "You Can Be Drake: Creating a Voice That Isn't Real"](https://learnweb3.io/degrees/ai-developer-degree/sophomore-ai/you-can-be-drake-creating-a-voice-that-isnt-real/) guide. 

While the original guide provided a great foundation for understanding AI voice technology, it used legacy patterns and older models. This repository represents a **major modernization** and enhancement of that original concept.

---

## ✨ Modernization Features

We've taken the core idea and upgraded every layer of the stack to 2026 standards:

- **Ultra-Low Latency Streaming**: Unlike traditional implementations that wait for the full audio file to generate, FakeVoice AI uses **Next.js 16 Response Streaming**. The audio starts playing as it's being synthesized, reducing wait times to nearly zero.
- **ElevenLabs Flash v2.5**: Upgraded to the latest high-speed, high-fidelity model that supports 70+ languages with consistent accent accuracy.
- **Premium Glassmorphism UI**: A completely redesigned interface built with **Tailwind CSS**, **Framer Motion**, and **Lucide Icons**. It includes animated background blobs, noise textures, and smooth state transitions.
- **Smart Voice Selection**: Automatically syncs with your ElevenLabs account to display your custom cloned voices alongside generated identities.
- **Next.js 16 & React 19**: Built on the bleeding edge of the React ecosystem for maximum performance and stability.

---

## 🛠️ Get it Started

Follow these steps to get FakeVoice AI up and running locally in under 2 minutes.

### 1. Prerequisites

You will need an **ElevenLabs API Key**. 
- Sign up at [ElevenLabs.io](https://elevenlabs.io/)
- Go to your Profile Settings to find your API Key.

### 2. Clone the Repository

```bash
git clone https://github.com/JasonRandazza/fakevoice.git
cd fakevoice
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your ElevenLabs API Key:

```env
XI_API_KEY="your_api_key_here"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start synthesizing!

---

## 🎨 Technologies Used

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **AI Audio**: [ElevenLabs API](https://elevenlabs.io/api)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📝 License

This project is open-source. Feel free to use it for your portfolio or as a base for your own AI voice applications.

Built with ❤️ by [Jason Randazza](https://github.com/JasonRandazza)
