'use strict';


var recognition = new window.webkitSpeechRecognition();
    function speak(text, callback) {
            var u = new window.SpeechSynthesisUtterance();
            u.text = text;
            u.lang = 'en-US';


            u.onend = function () {
                if (callback) {
                    callback();
                }
            };

            u.onerror = function (e) {
                if (callback) {
                    callback(e);
                }
            };
            window.speechSynthesis.speak(u);
        }





	function hear(callback) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US' ;

 		recognition.onresult = function (e) {
            recognition.onend = null;
            if (callback) {
                callback(null, {
                    transcript: e.results[0][0].transcript,
                    confidence: e.results[0][0].confidence
                });
            }
        };
        recognition.onend = function () {
            if (callback) {
                callback('no results');
            }
        };

        recognition.start();
    }

    var tab = [];

    function getInnerHTML(steps) {
        var res =[];

        for (var i = 0; i < steps.length; i++) {
            res[i] = steps[i].innerHTML;

        }
        return res;
    }

    function speakAll (route) {
        for (var i = 0; i < route.length; i++) {
            speak(route[i]);
        }
    }


    function getCommands() {
				var xml = '<?xml version="1.0"?><request><origin>'+tab[0]+'</origin><destination>'+tab[1]+'</destination></request>';

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( 'POST', '/api/routes', false );
				xmlHttp.setRequestHeader('Content-Type', 'application/xml');
        xmlHttp.send( xml );
        if (xmlHttp.status === 200) {
          if(!xmlHttp.responseXML.querySelector('error')) {
            speakAll(getInnerHTML(xmlHttp.responseXML.querySelectorAll('step')));
          } else {
            speak('There is no results for this query');
          }
        } else {
          speak('Server errors try again later.');
        }
    }

    function getEndPoint() {
        speak('Next, Please enter a destination', function() {
            hear(function(err, res){
                if(err) {
                    return err;
                }

                if (res.confidence > 0.9) {
                    tab.push(res.transcript);
                    getCommands();
                } else {
                    speak('Please repeat again', function() {
                      hear(function(err, res){
                          if(err) {
                              return err;
                          }

                          if (res.confidence >0.9) {
                              tab.push(res.transcript);
                              getCommands();
                          }
                      });
                    });
                }
            });
        });
    }

    function getStartingPoint() {
        speak('Hello! Please enter starting point.', function() {
            hear(function(err, res){
                if(err) {
                    return err;
                }

                if (res.confidence > 0.9) {
                    tab.push(res.transcript);
                    getEndPoint();
                } else {
                    speak('Please repeat again', function() {
                      hear(function(err, res){
                          if(err) {
                              return err;
                          }

                          if (res.confidence >0.9) {
                              tab.push(res.transcript);
                              getEndPoint();
                          }
                      });
                    });
                }
            });
        });
    }



document.querySelector('.runBtn').addEventListener('click', function() {
  getStartingPoint();
});
