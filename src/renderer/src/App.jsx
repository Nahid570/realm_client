import { useState } from 'react'

const App = () => {
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      name,
      roll
    }
    window.electronAPI.studentData(data)
    // console.log(window.electronAPI.studentData)
  }

  return (
    <form
      style={{ display: 'flex', gap: '10px', flexDirection: 'column', width: '50%' }}
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name..."
        onChange={(e) => setName(e.target.value)}
        value={name}
        style={{ padding: '20px', outline: 'none' }}
      />
      <input
        type="text"
        name="roll"
        placeholder="Your Roll..."
        onChange={(e) => setRoll(e.target.value)}
        value={roll}
        style={{ padding: '20px', outline: 'none' }}
      />
      <button
        type="submit"
        style={{ padding: '10px', outline: 'none', border: 'none', cursor: 'pointer' }}
      >
        Submit
      </button>
    </form>
  )
}

export default App
