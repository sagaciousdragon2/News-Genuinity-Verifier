import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './header';
import Sidebar from './sidebar';
import { Check2, X } from 'react-bootstrap-icons';
import Axios from 'axios';

function Home() {
  document.title = 'Genuineness Verifier | Home';
  let stage = 1;

  const [liveNewsData, setLiveNewsData] = useState([]);
  const [mustSeeNews, setMustSeeNews] = useState([]);
  const [allNews, setAllNews] = useState([]);

  const categories = ['Sport', 'Lifestyle', 'Arts', 'News'];

  // Function to fetch live news data
  const fetchLiveNewsData = () => {
    Axios.get('http://genuinenessverifier.test:8000/api/live/')
      .then((response) => {
        setLiveNewsData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error', error);
      });

    Axios.get('http://genuinenessverifier.test:8000/api/category/News/')
      .then((response) => {
        setMustSeeNews(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error', error);
      });

    const fetchPromises = categories.map((category) => {
      return Axios.get(`http://genuinenessverifier.test:8000/api/category/${category}/`)
        .then((response) => {
          if (response.data.length > 0) {
            return response.data[0]; // Return the news data
          }
        })
        .catch((error) => {
          console.error('Error', error);
        });
    });

    // Use Promise.all to handle all promises
    Promise.all(fetchPromises)
      .then((newsData) => {
        // Filter out undefined values (failed requests)
        const filteredNewsData = newsData.filter((data) => data !== undefined);
        setAllNews(filteredNewsData);
        console.log('All news fetched and added.');
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  // Fetch initial live news data on component mount
  useEffect(() => {
    fetchLiveNewsData();

    const intervalId = setInterval(() => {
      fetchLiveNewsData();

    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  let newsData = [];
  newsData = liveNewsData;

  return (
    <>
      <Sidebar />
      <Header activeContainer={stage} />
      <Container className="home-container shadow-lg">
        <div className="live-news-container-header py-4 border-bottom border-secondary border-opacity-25 mb-5">
          <img src={process.env.PUBLIC_URL + '/live.gif'} height={40} className="logo-image" alt="Live News" />
        </div>

        {liveNewsData.length >= 10 ? (
          <Container className='new-news-container p-0 border-0 bg-transparent'>
            {/* Hero Section */}
            <Row className='news-row align-items-center mb-5 gx-5'>
              <Col lg={7} className="mb-4 mb-lg-0">
                <div className='hero-article-content p-4 glass-card'>
                  <span className="source-tag mb-3 d-inline-block px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-bold">TOP STORY</span>
                  <h1 className='display-5 fw-bold mb-4 text-gradient'>{liveNewsData[0].title}</h1>
                  <div className='div-kjpql d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary border-opacity-25'>
                    <span className="opacity-75">{new Date(liveNewsData[0].publication_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <div className='div-kpqsa ml-0'>
                      {liveNewsData[0].prediction ?
                        <span className='real-news-prediction px-3 py-2'><Check2 /> REAL</span> :
                        <span className='fake-news-prediction px-3 py-2'><X /> FAKE</span>
                      }
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={5}>
                {liveNewsData[0].img_url !== 'None' && (
                  <div className="hero-img-wrapper overflow-hidden rounded-4 shadow-2xl">
                    <img src={liveNewsData[0].img_url} className="img-fluid hero-img w-100 h-100 object-fit-cover" alt="Hero" />
                  </div>
                )}
              </Col>
            </Row>

            <hr className="my-5 opacity-25" />

            {/* Secondary Grid */}
            <Row className="news-grid mt-5 g-4">
              {liveNewsData.slice(1, 4).map((news, index) => (
                <Col lg={4} key={index}>
                  <div className="news-card-inner glass-card p-4 h-100">
                    {news.img_url !== 'None' && (
                      <div className="mb-3 rounded-3 overflow-hidden shadow-sm aspect-video">
                        <img src={news.img_url} className="img-fluid w-100 h-100 object-fit-cover" alt="News" />
                      </div>
                    )}
                    <h5 className="mb-3 lh-base">{news.title}</h5>
                    <div className="div-kjpql mt-auto pt-3 border-top border-secondary border-opacity-10">
                      <span className="small opacity-50">{new Date(news.publication_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {news.prediction ? (
                        <span className="real-news-prediction small">REAL</span>
                      ) : (
                        <span className="fake-news-prediction small">FAKE</span>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* List Row */}
            <Row className="news-grid-row mt-4 g-4">
              {liveNewsData.slice(4, 9).map((news, index) => (
                <Col md={6} lg={4} key={index}>
                  <div className="live-news-title-container h-100 border-0 glass-card p-3">
                    <h6 className="mb-3 lh-sm">{news.title}</h6>
                    <div className="div-kjpql pt-2 border-top border-secondary border-opacity-10">
                      <span className="small opacity-50">{new Date(news.publication_date).toLocaleDateString()}</span>
                      {news.prediction ? (
                        <span className="real-news-prediction small py-1 px-2 border-0 bg-transparent"><Check2 /> Verified</span>
                      ) : (
                        <span className="fake-news-prediction small py-1 px-2 border-0 bg-transparent"><X /> Flagged</span>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        ) : (
          <div className="loading-state py-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="opacity-50">Synchronizing global intelligence feeds...</p>
          </div>
        )
        }

        <div className='heading-title'>
          <h3 className='heading-word'>Must See</h3>
          <hr />
        </div>

        {mustSeeNews.length > 0 ? (
          <Row className="mb-5 g-4">
            {mustSeeNews.slice(0, 4).map((news, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="news-card-inner glass-card p-3 h-100">
                  {news.img_url !== "None" && (
                    <div className="mb-2 rounded-2 overflow-hidden aspect-video">
                      <img src={news.img_url} className="img-fluid w-100 h-100 object-fit-cover" alt="News" />
                    </div>
                  )}
                  <p className="small fw-semibold mb-2 lh-base">{news.title}</p>
                  <div className="div-kjpql pt-2 mt-auto">
                    {news.prediction ? <span className="text-success small fw-bold">Real</span> : <span className="text-danger small fw-bold">Fake</span>}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : <div className="text-center py-5 opacity-25">Compiling specific archives...</div>
        }

        <div className='heading-title'>
          <h3 className='heading-word'>Global Archive</h3>
          <hr />
        </div>

        <Row className="g-4 mb-5">
          {allNews.length > 0 ? allNews.slice(0, 4).map((news, index) => (
            <Col md={6} key={index}>
              <div className="live-news-title-container glass-card border-0 p-3 h-100">
                <Row className="align-items-center g-3">
                  <Col xs={4}>
                    {news.img_url !== "None" && <img src={news.img_url} className="img-fluid rounded-3 shadow-sm" alt="News" />}
                  </Col>
                  <Col xs={8}>
                    <p className="mb-2 small fw-bold lh-sm">{news.title}</p>
                    <div className="d-flex justify-content-between x-small opacity-50">
                      <span>{new Date(news.publication_date).toLocaleDateString()}</span>
                      {news.prediction ? <span className="text-success">Verified</span> : <span className="text-danger">Flagged</span>}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          )) : <div className="col-12 text-center py-5 opacity-25 mb-5">Accessing historical data repository...</div>}
        </Row>
      </Container>
    </>
  );
}

export default Home;
