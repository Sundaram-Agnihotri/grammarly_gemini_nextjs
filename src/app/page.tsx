"use client"
import styles from "./page.module.css";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API


export default function Home() {
  const [text, setText] = useState('')
  const [fixedText, setFixedText] = useState('')
  const [isSending, setIsSending] = useState(false)

  const trainingPrompt = [
    {
      "parts": [{
        "text": "From next prompt I will be just providing you some text or sentence or paragraph, rewrite the grammar for me."
      }
      ],
      "role": "user"
    },
    {
      "parts": [
        {
          "text": "okay"
        }
      ],
      "role": "model"
    }
  ]

  const FixText = async () => {
    console.log(text)
    let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY

    let messageToSend = [
      ...trainingPrompt,
      {
        "parts": [{
          "text": text
        }
        ],
        "role": "user"
      }
    ]

    setIsSending(true)
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": messageToSend
      })
    })
    let resjson = await res.json()
    setIsSending(false)
    let responseMessage = resjson.candidates.content.parts[0].text
    console.log(responseMessage)
    setFixedText(responseMessage)
  }
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <textarea
          className={styles.input}
          placeholder="Write your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {
          fixedText.length > 0 ?
            <p className={styles.fixed}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{fixedText}</span>
            </p>
            :
            <p className={styles.notfixed}>
              Promt is empty...
            </p>
        }

      </div>
      <button className={styles.button}
        onClick={FixText}
      >Fix</button>

    </div>
  );
}
