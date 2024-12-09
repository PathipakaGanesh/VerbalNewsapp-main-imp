import React, { useEffect, useState, useRef } from 'react';
import './VoiceIntegration.css'; // CSS for additional styling

const VoiceIntegration = ({ articles, onNavigate, mode, setHighlightedIndex ,handlePageChange}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isReadingNews, setIsReadingNews] = useState(false);
  const currentIndexRef = useRef(-1);
  const articleRefs = useRef([]);

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;

    speechRecognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log(`Voice Command: ${transcript}`);

      if (transcript.includes('read more')) {
        handleReadMore();
      } else if (transcript.includes('next')) {
        handleNextCommand();
      } else if (transcript.includes('previous')) {
        handlePreviousCommand();
      }else if (transcript.includes('move')) {
        handleNextNews();
      } else if (transcript.includes('back')) {
        handlePreviousNews();
      } else if (transcript.includes('read news')) {
        setIsReadingNews(true);
      } else if (transcript.includes('read description')) {
        handleReadDescription(transcript);
      } else if (transcript.includes('read article')) {
        handleReadArticle(transcript);
      } else if (transcript.includes('read extra')) {
        readCurrentDescription();
      } else if (transcript.includes('go to sports section')) {
        onNavigate('/sports');
      } else if (transcript.includes('go to home section')) {
        onNavigate('/home');
      } else if (transcript.includes('go to business section')) {
        onNavigate('/business');
      } else if (transcript.includes('go to entertainment section')) {
        onNavigate('/entertainment');
      } else if (transcript.includes('stop reading')) {
        setIsReadingNews(false);
        window.speechSynthesis.cancel();
      } else {
        handleUnknownCommand();
      }
    };

    speechRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('An error occurred during speech recognition. Please try again.');
    };

    setRecognition(speechRecognition);

    return () => {
      speechRecognition.stop();
    };
  }, [articles, onNavigate]);

  useEffect(() => {
    if (isReadingNews) {
      readAllNews();
    }
  }, [isReadingNews]);

  const setCurrentIndex = (index) => {
    currentIndexRef.current = index;
    setHighlightedIndex(index);
    if (articleRefs.current[index]) {
      articleRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleReadMore = () => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex >= 0 && currentIndex < articles.length) {
      const currentArticle = articles[currentIndex];
      if (currentArticle.url) {
        window.open(currentArticle.url, '_blank');
      } else {
        const utterance = new SpeechSynthesisUtterance(
          'No URL available to read more about this article.'
        );
        utterance.voice = window.speechSynthesis.getVoices()[0];
        window.speechSynthesis.speak(utterance);
      }
    } else {
      const utterance = new SpeechSynthesisUtterance('No article is currently selected.');
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    }
  };

  const readCurrentArticle = (index) => {
    if (index >= 0 && index < articles.length) {
      const article = articles[index];
      const utterance = new SpeechSynthesisUtterance(article.title);
      utterance.voice = window.speechSynthesis.getVoices()[0];
      
      // Ensure the article is visible when being read
      if (articleRefs.current[index]) {
        articleRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  
      window.speechSynthesis.speak(utterance);
    }
  };
  

  const handleNextNews = () => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex + 1 < articles.length) {
      setCurrentIndex(currentIndex + 1);
      readCurrentArticle(currentIndex + 1);
    } else {
      const utterance = new SpeechSynthesisUtterance('No more news available.');
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePreviousNews = () => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
      readCurrentArticle(currentIndex - 1);
    } else {
      const utterance = new SpeechSynthesisUtterance('No previous news available.');
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReadDescription = (transcript) => {
    const index = parseInt(transcript.split('read description ')[1], 10) - 1;
    if (index >= 0 && index < articles.length) {
      setCurrentIndex(index);
      const utterance = new SpeechSynthesisUtterance(articles[index].description || 'No description available.');
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    } else {
      handleError(index);
    }
  };

  const handleNextCommand = () => {
    handlePageChange('next');
    const utterance = new SpeechSynthesisUtterance('Loading next articles.');
    utterance.voice = window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(utterance);
  };

  const handlePreviousCommand = () => {
    handlePageChange('prev');
    const utterance = new SpeechSynthesisUtterance('Loading previous articles.');
    utterance.voice = window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(utterance);
  };

  const readAllNews = () => {
    let index = 0;
    const readNextArticle = () => {
      if (!isReadingNews || index >= articles.length) {
        setIsReadingNews(false);
        return;
      }

      setCurrentIndex(index);
      const article = articles[index];
      
      // Read article number as "Article number X"
      const numberUtterance = new SpeechSynthesisUtterance(`Article number ${convertNumberToWords(index + 1)}`);
      numberUtterance.voice = window.speechSynthesis.getVoices()[0];
      numberUtterance.onend = () => {
        const utterance = new SpeechSynthesisUtterance(article.title);
        utterance.voice = window.speechSynthesis.getVoices()[0];

        utterance.onend = () => {
          index += 1;
          if (isReadingNews) readNextArticle();
        };

        window.speechSynthesis.speak(utterance);
      };

      window.speechSynthesis.speak(numberUtterance);
    };

    readNextArticle();
  };

  const convertNumberToWords = (num) => {
    const words = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 
      'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two',
      'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven',
      'twenty-eight', 'twenty-nine', 'thirty', 'thirty-one', 'thirty-two', 
      'thirty-three', 'thirty-four', 'thirty-five', 'thirty-six', 'thirty-seven', 
      'thirty-eight', 'thirty-nine', 'forty', 'forty-one', 'forty-two', 'forty-three',
      'forty-four', 'forty-five', 'forty-six', 'forty-seven', 'forty-eight', 'forty-nine',
      'fifty', 'fifty-one', 'fifty-two', 'fifty-three', 'fifty-four', 'fifty-five', 
      'fifty-six', 'fifty-seven', 'fifty-eight', 'fifty-nine', 'sixty', 'seventy', 'eighty', 
      'ninety', 'hundred', 'thousand'
    ];
    return num <= words.length ? words[num] : num.toString();
  };


  const handleReadArticle = (transcript) => {
    const index = parseInt(transcript.split('read article ')[1], 10) - 1;
    if (index >= 0 && index < articles.length) {
      setCurrentIndex(index);
      
      // Read article number as "Article number X"
      const numberUtterance = new SpeechSynthesisUtterance(`Article number ${convertNumberToWords(index + 1)}`);
      numberUtterance.voice = window.speechSynthesis.getVoices()[0];
      numberUtterance.onend = () => {
        const utterance = new SpeechSynthesisUtterance(articles[index].title);
        utterance.voice = window.speechSynthesis.getVoices()[0];
        window.speechSynthesis.speak(utterance);
      };

      window.speechSynthesis.speak(numberUtterance);
    } else {
      handleError(index);
    }
  };


  const readCurrentDescription = () => {
    const currentIndex = currentIndexRef.current;
    if (currentIndex >= 0 && currentIndex < articles.length) {
      const article = articles[currentIndex];
      const utterance = new SpeechSynthesisUtterance(
        article.description || 'No description available for this article.'
      );
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    } else {
      const utterance = new SpeechSynthesisUtterance('No article is currently selected.');
      utterance.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleError = (index) => {
    const utterance = new SpeechSynthesisUtterance(
      `Article number ${index + 1} doesn't exist. Please try again.`
    );
    utterance.voice = window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(utterance);
  };

  const handleUnknownCommand = () => {
    const utterance = new SpeechSynthesisUtterance(
      "I can't understand. Could you please give a proper command?"
    );
    utterance.voice = window.speechSynthesis.getVoices()[0];
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="voice-icon-container">
      <svg
        onClick={toggleListening}
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill={isListening ? 'green' : 'white'} // Ensuring the icon is visible
        stroke={isListening ? 'green' : 'black'} // Adjust stroke color
        strokeWidth="2"
        className="voice-icon"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="12" x2="12" y2="18" />
      </svg>
    </div>
  );
};

export default VoiceIntegration;
