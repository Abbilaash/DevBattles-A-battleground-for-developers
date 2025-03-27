import React, { useState } from "react";
import axios from "axios";

const CreateChallenge = () => {
  const [challengeName, setChallengeName] = useState("");
  const [questions, setQuestions] = useState([
    {
      title: "",
      description: "",
      difficulty: "Easy",
      tags: "",
      testCases: [{ input: "", output: "" }], // Updated: Each test case has both input & output
      sampleTestCase: { input: "", output: "" },
    },
  ]);

  const handleChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleTestCaseChange = (qIndex, tcIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases[tcIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addTestCase = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases.push({ input: "", output: "" });
    setQuestions(newQuestions);
  };

  const removeTestCase = (qIndex, tcIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases = newQuestions[qIndex].testCases.filter((_, i) => i !== tcIndex);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        description: "",
        difficulty: "Easy",
        tags: "",
        testCases: [{ input: "", output: "" }],
        sampleTestCase: { input: "", output: "" },
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/admin/create-challenge", {
        challengeName,
        questions,
      });
      alert("Challenge created successfully!");
    } catch (error) {
      console.error("Error creating challenge", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Create Coding Challenge</h2>
      <label>Challenge Name:</label>
      <input
        type="text"
        value={challengeName}
        onChange={(e) => setChallengeName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      {questions.map((q, index) => (
        <div key={index} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px" }}>
          <h3>Question {index + 1}</h3>
          <label>Title:</label>
          <input
            type="text"
            value={q.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />

          <label>Description:</label>
          <textarea
            value={q.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            style={{ width: "100%", padding: "10px", height: "100px" }}
          />

          <label>Difficulty:</label>
          <select
            value={q.difficulty}
            onChange={(e) => handleChange(index, "difficulty", e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={q.tags}
            onChange={(e) => handleChange(index, "tags", e.target.value)}
            style={{ width: "100%", padding: "10px" }}
          />

          <h4>Test Cases:</h4>
          {q.testCases.map((tc, tcIndex) => (
            <div key={tcIndex} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
              <label>Test Case {tcIndex + 1} Input:</label>
              <input
                type="text"
                value={tc.input}
                onChange={(e) => handleTestCaseChange(index, tcIndex, "input", e.target.value)}
                style={{ width: "100%", padding: "10px" }}
              />

              <label>Expected Output:</label>
              <input
                type="text"
                value={tc.output}
                onChange={(e) => handleTestCaseChange(index, tcIndex, "output", e.target.value)}
                style={{ width: "100%", padding: "10px" }}
              />

              <button onClick={() => removeTestCase(index, tcIndex)} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "5px" }}>
                Delete Test Case
              </button>
            </div>
          ))}

          <button onClick={() => addTestCase(index)} style={{ backgroundColor: "green", color: "white", padding: "5px", marginTop: "10px" }}>
            Add Test Case
          </button>

          <h4>Sample Test Case: (Show to player)</h4>
          <label>Input:</label>
          <input
            type="text"
            value={q.sampleTestCase.input}
            onChange={(e) => handleChange(index, "sampleTestCase", { ...q.sampleTestCase, input: e.target.value })}
            style={{ width: "100%", padding: "10px" }}
          />

          <label>Expected Output:</label>
          <input
            type="text"
            value={q.sampleTestCase.output}
            onChange={(e) => handleChange(index, "sampleTestCase", { ...q.sampleTestCase, output: e.target.value })}
            style={{ width: "100%", padding: "10px" }}
          />

          <button onClick={() => removeQuestion(index)} style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "10px" }}>
            Delete Question
          </button>
        </div>
      ))}

      <button onClick={addQuestion} style={{ backgroundColor: "green", color: "white", padding: "10px", marginRight: "10px" }}>
        Add Question
      </button>

      <button onClick={handleSubmit} style={{ backgroundColor: "blue", color: "white", padding: "10px" }}>
        Submit Challenge
      </button>
    </div>
  );
};

export default CreateChallenge;
