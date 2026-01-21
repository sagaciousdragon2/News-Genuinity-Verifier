import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './header';
import Sidebar from './sidebar';
import { Container, Form, Button } from 'react-bootstrap';
import Axios from 'axios';
import { Check2, X } from 'react-bootstrap-icons';


function CheckByTitle() {
  document.title = 'Genuineness Verifier | Search and Verify';
  let stage = 2;
  const [inputNewsTitle, setNewsTitle] = useState('');
  const [predictedValue, setPredictedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      user_news: inputNewsTitle,
    };

    Axios.post('http://genuinenessverifier.test:8000/api/usercheck/title/', dataToSend)
      .then((response) => {
        if (response.data.status === 'irrelevant') {
          setPredictedValue('Irrelevant');
          toast.warn("Enter relevant news");
        } else if (response.data.prediction === true) {
          setPredictedValue('True');
          toast.success("Real news!");
        } else {
          setPredictedValue('False');
          toast.error("Fake news!", { icon: <X style={{ color: 'white', backgroundColor: 'red' }} /> });
        }
      })
      .catch((error) => {
        console.error('Error submitting data: ', error);
        handleErrors(); // Call handleErrors to display the error toast
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const length_error = () => toast.error('Enter some text!');

  const handleErrors = () => {
    if (inputNewsTitle.length < 1) {
      console.log(inputNewsTitle.length);
      length_error(); // Call length_error to display the length error toast
    }
  };

  return (
    <>
      <Sidebar />
      <Header activeContainer={stage} />
      <Container fluid="lg" className="check-by-title-container shadow-lg">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-gradient">Search and Verify</h2>
          <p className="text-secondary opacity-75">Cross-reference headlines with our neural network to verify authenticity</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className='frm-opalq'>Headline Input</Form.Label>
            <Form.Control
              className='frm-moqpa'
              type="text"
              placeholder="Paste the news title here for real-time analysis..."
              as="textarea"
              rows={4}
              onChange={(e) => setNewsTitle(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" type="submit" className='button-17 px-5 py-3'>
              {isLoading ? 'Processing Intelligence...' : 'Validate Headline'}
            </Button>
          </div>
        </Form>
      </Container>

      <Container className='prediction-result-container'>

        {predictedValue === 'True' ? (
          <div className='true glass-card'><Check2 className='true-news-icon' /> Predicted as real news!</div>
        ) : predictedValue === 'False' ? (
          <div className='false glass-card'><X className='fake-news-icon' /> Predicted as fake news!</div>
        ) : predictedValue === 'Irrelevant' ? (
          <div className='irrelevant-text glass-card text-center'>
            Please enter a relevant news headline for analysis.
          </div>
        ) : null}

      </Container>


      <ToastContainer />
    </>
  );
}

export default CheckByTitle;
