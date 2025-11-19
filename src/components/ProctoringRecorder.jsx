import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'

export default function ProctoringRecorder({ attemptId }) {
  const socketRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true })
    const s = socketRef.current
    s.on('connect', () => console.log('socket connected', s.id))
    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!consentGiven || !attemptId) return

    const startCapture = async () => {
      try {
        // request webcam + mic
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = stream

        // join attempt room
        socketRef.current.emit('join-attempt', { attemptId })

        const options = { mimeType: 'video/webm;codecs=vp8,opus' }
        const recorder = new MediaRecorder(stream, options)
        mediaRecorderRef.current = recorder

        recorder.addEventListener('dataavailable', async (event) => {
          if (event.data && event.data.size > 0) {
            // read as ArrayBuffer and send via socket
            const arrayBuffer = await event.data.arrayBuffer()
            socketRef.current.emit('recording-chunk', { attemptId, chunk: arrayBuffer })
          }
        })

        recorder.addEventListener('stop', async () => {
          // signal server to finalize
          socketRef.current.emit('recording-finish', { attemptId })
          // stop tracks
          stream.getTracks().forEach(t => t.stop())
          setIsRecording(false)
        })

        // start recording and emit blobs every 2000ms (2s)
        recorder.start(2000)
        setIsRecording(true)
      } catch (err) {
        console.error('getUserMedia failed', err)
        alert('Camera/microphone permission required for proctoring.')
      }
    }

    startCapture()

    // cleanup on unmount
    return () => {
      try {
        mediaRecorderRef.current?.stop()
      } catch {}
      streamRef.current?.getTracks()?.forEach(t => t.stop())
    }
  }, [consentGiven, attemptId])

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  return (
    <div className="p-3 bg-yellow-50 border rounded">
      <h3 className="font-semibold">Proctoring Recorder</h3>
      {!consentGiven ? (
        <div className="mt-2">
          <p className="text-sm">This exam will record your webcam and audio for proctoring purposes. Recordings are kept for review. By clicking \"I consent\" you agree to be recorded.</p>
          <div className="mt-2">
            <button onClick={() => setConsentGiven(true)} className="bg-blue-600 text-white px-3 py-1 rounded">I consent</button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <div>Status: {isRecording ? 'Recording' : 'Not recording'}</div>
          <div className="mt-2">
            <button onClick={stopRecording} className="bg-red-600 text-white px-3 py-1 rounded" disabled={!isRecording}>Stop Recording</button>
          </div>
        </div>
      )}
    </div>
  )
}
