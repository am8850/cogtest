$(function () {

    // Initialize the variables
    var testResults = [];
    var round = 0;
    var startTime, endTime;
    var gameType = 0;
    var answer = false;
    var even, odd, high, low = false;
    var maxRound = 20;
    var images = [];
    var canPlay = false;
    var cols = 6;
    var initials = "";

    // Hide the areas
    $("#colors").hide();
    $("#results").hide();

    // Initialize the images
    var c=0;
    for (var i = 1; i <= 6; i++) {
        images.push("images/cat" + i.toString() + ".png");
        $("#c0").attr("src", images[c++]);
        images.push("images/dog" + i.toString() + ".png");
        $("#c1").attr("src", images[c++]);
    }

    $("#btnStart").click(function () {
        //alert('hello world!');
        $("#startdiv").hide();
        $("#colors").show();
        $("#txtInput").val("");
        initials = $("#initials").val();
        var tries = $("#tries").val();
        //alert(initials + " " + tries);
        //alert('hello');
        if (tries && parseInt(tries)) {
            maxRound = tries;
        }
        round = 0;        
        canPlay = true;
        $("#txtInput").focus();
        startTest();
    })

    $("#txtInput").keyup(function (event) {
        // No
        if (!canPlay)
            return;
        if (event.key === "1" || event.key === "End") {
            elapsed = end();
            round++;
            var gameResult = {
                gameType: gameType,
                elapsedTime: elapsed,
                answer: (gameType === 1 && !even) || (gameType === 2 && !odd) || (gameType === 3 && !low) || (gameType === 4 && !high)
            }
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
            testResults.push(gameResult);
            $("#txtInput").val("");
            startTest();
        }
        if (round >= maxRound) {
            gameEnd();
            $("#colors").hide();
            $("#results").show();
        }
    })

    function gameEnd() {
        // Signal that it can no loger play
        canPlay = false;
        // Build a report
        $("#rinitials").html(initials);
        var html = "<table id='tbresults' class='table table-striped'>";
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
        html += "<br/>Total Time: " + totalTime.toFixed(1) +" (s)"
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
                low = pics <= parseInt(cols/2);
                break;
            case 4:
                question = "High ?";
                high = pics > parseInt(cols/2);
                break;
        }

        $("#question").text(question);
        refreshCels(pics);
    }

    function refreshCels(num) {

        // Reset the image
        for (var i = 0; i < cols; i++) {
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
        //return Math.round(timeDiff);
        return parseFloat(timeDiff.toFixed(1));
    }
})

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

function exportF(elem) {
    var table = document.getElementById("tbresults");
    var html = table.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url 
    elem.setAttribute("href", url);
    elem.setAttribute("download", "export.xls"); // Choose the file name
    return false;
  }
