$(function () {

    var testResults = [];
    var round = 0;
    var startTime, endTime;
    var gameType = 0;
    var answer = false;
    var even, odd, high, low = false;
    var maxRound = 20;
    var images = [];

    for (var i = 1; i <= 6; i++) {
        images.push("images/cat" + i.toString() + ".png");
        images.push("images/dog" + i.toString() + ".png");
    }
    //console.info(images);

    $("#colors").hide();
    $("#results").hide();

    $("#btnStart").click(function () {
        //alert('hello world!');
        $("#btnStart").hide();
        $("#colors").show();
        $("#txtInput").val("");
        round = 0;
        startTest();
        $("#txtInput").focus();
    })

    $("#txtInput").keyup(function (event) {
        // No
        if (event.key === "1" || event.key === "End") {
            elapsed = end();
            round++;
            var gameResult = {
                gameType: gameType,
                elapsedTime: elapsed,
                answer: (gameType === 1 && !even) || (gameType === 2 && !odd) || (gameType === 3 && !low) || (gameType === 4 && !high)
            }
            console.info(gameResult);
            testResults.push(gameResult);
            $("#txtInput").val("");
            startTest();

        }
        // Yes
        if (event.key === "3" || event.key == "PgDn") {
            elapsed = end();
            round++;
            var gameResult = {
                gameType: gameType,
                elapsedTime: elapsed,
                answer: (gameType === 1 && even) || (gameType === 2 && odd) || (gameType === 3 && low) || (gameType === 4 && high)
            }
            console.info(gameResult);
            testResults.push(gameResult);
            $("#txtInput").val("");
            startTest();
        }
        //console.info(event);
        if (round >= maxRound) {
            gameEnd();
            $("#colors").hide();
            $("#results").show();
        }
    })

    function gameEnd() {
        // Build a report
        var html = "<table class='table table-striped'>";
        var totalTime = 0;
        var correctAnswers = 0;
        var IncorrectAnswers = 0;
        html += "<tr><th>Type</th><th>Answer</th><th>Time (s)</th></tr>";
        for (var i = 0, len = testResults.length; i < len; i++) {
            var item = testResults[i];
            var gLabel = "";
            switch (item.gameType) {
                case 1:
                    gLabel = "Even";
                    break;
                case 2:
                    gLabel = "Odd";
                    break;
                case 3:
                    gLabel = "Low";
                    break;
                case 4:
                    gLabel = "High";
                    break;
            }
            html += "<tr>";
            html += "<td>" + gLabel + "</td>";
            html += "<td>" + (item.answer ? "Correct" : "Incorrect") + "</td>";
            html += "<td>" + item.elapsedTime + "</td>";
            html += "</tr>";
            totalTime += item.elapsedTime;
            correctAnswers += item.answer ? 1:0;
            IncorrectAnswers += !item.answer ? 1:0;
        }
        html += "<tr><td colspan='3'>";
        html += "<strong>Summary:</strong>";
        html += "<br/>Total Time: " + totalTime.toString() +" (s)"
        html += "<br/>Total Questions: " + maxRound;
        html += "<br/>Correct Answers: " + correctAnswers.toString();
        html += "<br>Incorrect Answers: " + IncorrectAnswers.toString();
        html += "</td></tr>";
        html += "</table>";
        $("#resTable").html(html);
    }

    function setGame(type) {

        var pics = getRandom(1, 8);
        even = false, odd = false, high = false, low = false;
        var question = "";
        switch (type) {
            case 1:
                question = "Even ?";
                even = pics % 2 === 0;
                break;
            case 2:
                question = "Odd ?";
                odd = pics % 2 !== 0;
                break;
            case 3:
                question = "Low ?";
                low = pics <= 4;
                break;
            case 4:
                question = "High ?";
                high = pics > 4;
                break;
        }

        $("#question").text(question);
        refreshCels(pics);
    }

    function refreshCels(num) {
        for (var i = 0; i < 8; i++) {
            $("#c" + i.toString()).attr("src", "");
        }

        // Keep a list of the last selected game
        var list = [];
        for (var i = 0; i < num; i++) {
            var randomIdx = 0;
            var found = false;
            while (true) {
                randomIdx = getRandom(1, 12) - 1;
                if (!indexInList(list, randomIdx)) {
                    list.push(randomIdx);
                    break;
                }
            }
            $("#c" + i.toString()).attr("src", images[randomIdx]);
        }
    }

    function indexInList(list, idx) {
        if (list.length === 0) {
            return false;
        }
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] === idx) {
                return true;
            }
        }
        return false;
    }

    function startTest() {

        gameType = getRandom(1, 4);
        setGame(gameType);
        start();
    }

    function getRandom(low, high) {
        return Math.floor(Math.random() * high) + low
    }

    function start() {
        startTime = new Date();
    };

    function end() {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;

        // get seconds 
        return Math.round(timeDiff);

    }
})
