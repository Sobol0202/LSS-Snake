// ==UserScript==
// @name         Snake Game in Leitstellenspiel
// @namespace    www.leitstellenspiel.de
// @version      0.9
// @description  Snake Game in Leitstellenspiel einfügen
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Funktion zum Starten des Snake-Spiels
    function startSnakeGame() {
        var canvas = document.getElementById('game');
        var context = canvas.getContext('2d');

        var gridSize = 20;
        var count = 0;
        var score = 0;

        var snake = {
            x: gridSize * 4,
            y: gridSize * 4,
            dx: gridSize,
            dy: 0,
            cells: [],
            maxCells: 4
        };
        var symbols = ['🔥', '🧯', '⛑️', '💊', '🩺', '🫀', '🛬'];
        var emergencySymbols = ['🚒', '🚓', '🚑', '👮', '👮‍♀️', '👮‍♂️', '👮‍♂️', '👩‍⚕️', '👨‍⚕️', '👨‍🚒', '👩‍🚒'];

        var getRandomPosition = function () {
            return Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        };

        var getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        var getRandomSymbol = function (array) {
            return array[getRandomInt(0, array.length)];
        };

        // Definition des Apfels außerhalb der loop-Funktion
        var apple = {
            x: getRandomPosition(),
            y: getRandomPosition(),
            symbol: getRandomSymbol(symbols)
        };

        function loop() {
            requestAnimationFrame(loop);

            if (++count < 4) {
                return;
            }

            count = 0;
            // Hintergrundfarbe des Canvas setzen
            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);

            snake.x += snake.dx;
            snake.y += snake.dy;

            if (snake.x < 0) {
                snake.x = canvas.width - gridSize;
            } else if (snake.x >= canvas.width) {
                snake.x = 0;
            }

            if (snake.y < 0) {
                snake.y = canvas.height - gridSize;
            } else if (snake.y >= canvas.height) {
                snake.y = 0;
            }

            snake.cells.unshift({ x: snake.x, y: snake.y });

            if (snake.cells.length > snake.maxCells) {
                snake.cells.pop();
            }

            // Zeichne den Apfel
            context.font = '20px Arial';
            context.fillText(apple.symbol, apple.x, apple.y + gridSize);

            // Zeichne die Schlange
            snake.cells.forEach(function (cell, index) {
                var symbol = getRandomSymbol(emergencySymbols);
                context.fillText(symbol, cell.x, cell.y + gridSize);

                if (cell.x === apple.x && cell.y === apple.y) {
                    snake.maxCells++;

                    apple.x = getRandomPosition();
                    apple.y = getRandomPosition();
                    apple.symbol = getRandomSymbol(symbols);

                    // Erhöhe den Score beim Essen des Apfels
                    score += 1;
                }

                for (var i = index + 1; i < snake.cells.length; i++) {
                    if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                        snake.x = gridSize * 4;
                        snake.y = gridSize * 4;
                        snake.cells = [];
                        snake.maxCells = 4;
                        snake.dx = gridSize;
                        snake.dy = 0;

                        apple.x = getRandomPosition();
                        apple.y = getRandomPosition();
                        apple.symbol = getRandomSymbol(symbols);

                        // Setze den Score zurück bei Kollision mit dem eigenen Körper
                        score = 0;
                    }
                }
            });

            // Zeige den Score im Canvas an
            context.fillStyle = 'white';
            context.font = '20px Arial';
            context.fillText('Score: ' + score, 10, 20);
        }

        // Event-Listener für Tastatureingaben
        document.addEventListener('keydown', function (e) {
            if (e.which === 37 && snake.dx === 0) {
                snake.dx = -gridSize;
                snake.dy = 0;
            } else if (e.which === 38 && snake.dy === 0) {
                snake.dy = -gridSize;
                snake.dx = 0;
            } else if (e.which === 39 && snake.dx === 0) {
                snake.dx = gridSize;
                snake.dy = 0;
            } else if (e.which === 40 && snake.dy === 0) {
                snake.dy = gridSize;
                snake.dx = 0;
            }
        });

        // Setze Canvas-Dimensionen und starte das Spiel
        canvas.width = 400;
        canvas.height = 400;
        loop();
    }

    // Funktion zum Schließen der Lightbox
    function closeLightbox() {
        var lightbox = document.getElementById('snake-lightbox');
        lightbox.parentNode.removeChild(lightbox);
        // Aktiviere das Scrollen des Body-Elements, wenn die Lightbox geschlossen wird
        document.body.style.overflow = 'auto';
    }

    // Füge einen Button zum Öffnen der Lightbox hinzu
    var openLightboxButton = document.createElement('button');
    openLightboxButton.textContent = 'Snake Game';
    openLightboxButton.style.position = 'fixed';
    openLightboxButton.style.top = '10px';
    openLightboxButton.style.left = '10px';
    openLightboxButton.style.zIndex = '9999';

    openLightboxButton.addEventListener('click', function () {
        // Erstelle ein div-Element für die Lightbox
        var lightbox = document.createElement('div');
        lightbox.id = 'snake-lightbox';
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        lightbox.style.zIndex = '10000';

        // Erstelle ein div-Element für das Spiel
        var lightboxContent = document.createElement('div');
        lightboxContent.id = 'snake-lightbox-content';
        lightboxContent.style.position = 'absolute';
        lightboxContent.style.top = '50%';
        lightboxContent.style.left = '50%';
        lightboxContent.style.transform = 'translate(-50%, -50%)';
        lightboxContent.style.padding = '20px';
        lightboxContent.style.borderRadius = '10px';
        lightboxContent.style.backgroundColor = '#fff';

        // Erstelle ein Canvas-Element für das Spiel
        var gameCanvas = document.createElement('canvas');
        gameCanvas.width = 400;
        gameCanvas.height = 400;
        gameCanvas.id = 'game';

        // Füge das Canvas-Element zum Lightbox-Content hinzu
        lightboxContent.appendChild(gameCanvas);

        // Erstelle ein Schließkreuz (X) zum Schließen der Lightbox
        var closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.fontSize = '20px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.background = '#ccc';
        closeButton.style.color = '#333';
        closeButton.addEventListener('click', closeLightbox);

        // Füge das Schließkreuz und das Lightbox-Content-Element zur Lightbox hinzu
        lightboxContent.appendChild(closeButton);
        lightbox.appendChild(lightboxContent);

        // Füge die Lightbox zur Seite hinzu
        document.body.appendChild(lightbox);

        // Deaktiviere das Scrollen des Body-Elements, wenn die Lightbox geöffnet wird
        document.body.style.overflow = 'hidden';

        // Öffne die Lightbox und rufe startSnakeGame() auf
        startSnakeGame();
    });

    // Füge das Button-Element zur Seite hinzu
    document.body.appendChild(openLightboxButton);
})();
