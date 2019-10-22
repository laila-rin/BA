//Discord Modul laden und verbinden
const discord = require('discord.js')
const client = new discord.Client()


//Code, der getriggered wird, sobald der Bot erfolgreich connected ist
client.on('ready', () => { //ready-event wird getriggered nachdem der Bot connected ist
    console.log("Connected as " + client.user.tag)

    //setActivity ändert den Status des Bots
    client.user.setActivity("über deine Module", { type: "WATCHING" })

    //Zur Übersicht: printet in der Konsole alle Server, mit welchen sich der Bot verbindet
    client.guilds.forEach((guild) => {
        console.log(guild.name)
        //ID des general Channels von Alfred"s Service Server:618466465179369504
    })

    //Bot schickt Nachricht in den general Channel von Alfred"s Service Server
    //zum Zeichen, dass er erfolgreich verbunden ist
    let generalChannel = client.channels.get("618466465179369504")
    generalChannel.send("Hallo, ich bin online und stets zu Diensten!")
})


//Begrüßungsnachricht beim Beitritt in Alfred"s Service Server (in den DM)
client.on('guildMemberAdd', member => {
    if (!client.channels.get("618466465179369504")) return;
    member.send(`Willkommen in meinem Service Server, ${member}!\nWie kann ich dir behilfllich sein?`);
})


//message-event wird jedes Mal getriggered, wenn eine Nachricht in einen Channel geschickt wird, in dem der Bot aktiv ist
client.on('message', (recievedMessage) => {
    if (recievedMessage.author == client.user) {
        return //Verhindert, dass der Bot auf seine eigenen Nachrichten antwortet und so in einer Endlosschleife endet
    }


    //falls eine Nachricht in den DM direkt an Alfred geschickt wird, direkt antworten und nicht nur spezielle Befehlstrigger(@Alfred oder !)
    if (recievedMessage.guild == null) {
        if (recievedMessage.content.includes("wer bist du")) {
            recievedMessage.channel.send("Nett, dass du fragst " + recievedMessage.author.toString() + ".\nIch bin ein Bot, der dir bei"
                                        + " deiner Modulauswahl helfen soll. Besonders spezialisiert habe ich mich auf Vertiefungsmodule "
                                        + "- dazu kann ich dir alle möglichen Infos geben! Für eine Liste aller Befehle, die ich ausführen "
                                        + "kann schreibe mir einfach: !befehle.\nBitte beachte auch, dass ich für alle Infos, die ich dir gebe"
                                        + " keine Haftung übernehme. Das bedeutet ich helfe dir sehr gerne, kann dir aber nicht versichern, "
                                        + "dass meine Angaben stimmen.")
            return;
        }
        if (recievedMessage.content.startsWith("hallo") || recievedMessage.content.startsWith("Hallo")) {
            var zul = Math.floor(Math.random() * 10); //für eine Variation an Antworten auf eine Begrüßung
            if (zul == 0 || zul == 9) {
                recievedMessage.react("😄");
                recievedMessage.channel.send("Hi!");
            } else if (zul == 1 || zul == 8) {
                recievedMessage.react("😉");
                recievedMessage.channel.send("Hello");
            } else if (zul == 2 || zul == 7) {
                recievedMessage.react("😊");
                recievedMessage.channel.send("Hallo!");
            } else if (zul == 3 || zul == 6) {
                recievedMessage.react("😋");
                recievedMessage.channel.send("Hi Du!");
            } else {
                recievedMessage.react("😎");
                recievedMessage.channel.send("Hi " + recievedMessage.author.toString() + "!");
            } return;
        }
        let fullCommand = recievedMessage.content; //speichert den in der Nachricht enthaltenen String in fullCommand
        let splitCommand = fullCommand.split(" ");  
        //.split(" ") teilt den String an jedem Leerzeichen und speichert die Worte in einem String-Array splitCommand
        processCommandAusführen(recievedMessage, splitCommand);
    }

    //obere Befehle werden hier wiederholt, da der obere Code nur in den DM's funktioniert
    else if (recievedMessage.content.includes("wer bist du")) {
        recievedMessage.channel.send("Nett, dass du fragst " + recievedMessage.author.toString() + ".\nIch bin ein Bot, der dir bei deiner "
                                    + "Modulauswahl helfen soll. Besonders spezialisiert habe ich mich auf Vertiefungsmodule - dazu kann ich"
                                    + " dir alle möglichen Infos geben! Für eine Liste aller Befehle, die ich ausführen kann schreibe mir "
                                    + "einfach: !befehle.\nBitte beachte auch, dass ich für alle Infos, die ich dir gebe keine Haftung "
                                    + "übernehme. Das bedeutet ich helfe dir sehr gerne, kann dir aber nicht versichern, dass meine Angaben stimmen.")
    }

    else if (recievedMessage.content.startsWith("hilfe") || recievedMessage.content.startsWith("Hilfe")) {
        let fullCommand = recievedMessage.content;
        let splitCommand = fullCommand.split(" ");
        splitCommand.shift();
        processCommandAusführen(recievedMessage, splitCommand);
    }

    else if (recievedMessage.content.startsWith("hallo") || recievedMessage.content.startsWith("Hallo")) {
        var zul = Math.floor(Math.random() * 10);
        if (zul == 0 || zul == 9) {
            recievedMessage.react("😄");
            recievedMessage.channel.send(recievedMessage.author.toString() + "Hi!");
        } else if (zul == 1 || zul == 8) {
            recievedMessage.react("😉");
            recievedMessage.channel.send(recievedMessage.author.toString() + "Hello");
        } else if (zul == 2 || zul == 7) {
            recievedMessage.react("😊");
            recievedMessage.channel.send(recievedMessage.author.toString() + "Hallo!");
        } else if (zul == 3 || zul == 6) {
            recievedMessage.react("😋");
            recievedMessage.channel.send(recievedMessage.author.toString() + "Hi Du!");
        } else {
            recievedMessage.react("😎");
            recievedMessage.channel.send("Hi " + recievedMessage.author.toString() + "!");
        }
    } else if (recievedMessage.content.startsWith(client.user)) {
        let fullCommand = recievedMessage.content;
        let splitCommand = fullCommand.split(" ");
        splitCommand.shift(); 
        //zusätzlich wird hier das erste Wort (@Alfred) aus dem String-Array entfernt, da das als Trigger fungiert hat und nun nicht mehr benötigt wird
        processCommandAusführen(recievedMessage, splitCommand);
    }

    else if (recievedMessage.content.startsWith("!") /*|| recievedMessage.content.startsWith()*/) { 
                                                    //ODER EBEN WENN @BAT DIREKT ANGESPROCHEN WURDE
        let fullCommand = recievedMessage.content.substr(1) 
        //zusätzlich wird hier der erste Charakter, das '!', aus dem String entfernt, da dieser als Trigger fungiert hat und nun nicht mehr benötigt wird
        let splitCommand = fullCommand.split(" ")
        processCommandAusführen(recievedMessage, splitCommand);
    }
})

let alleModule = []; //ein Array aller Objekte von WisoModul

//die kommende Funktion fragt die Befehle ab und leitet sie zu den richtigen Funktionen weiter
function processCommandAusführen(recievedMessage, splitCommand) {
    if (splitCommand == 0) {
        recievedMessage.channel.send(recievedMessage.author.toString() + ", was kann ich für dich tun?\n !hilfe oder "
                                                                        + "!Befehle für eine Liste all meiner Befehle.")
        return;
    }

    let primaryCommandErstesWort = splitCommand[0]; //primaryCommandErstesWort enthält den Befehl
    let arguments = splitCommand.slice(1); //"schneidet" den Befehl vorne ab und speichert den restlichen String

    if (primaryCommandErstesWort.toLowerCase() == "danke") {
        var zufall = Math.floor(Math.random() * 10);
        if (zufall == 0 || zufall == 9) {
            recievedMessage.react("😄");
            recievedMessage.channel.send(recievedMessage.author.toString() + ": Ich helfe gerne!");
        } else if (zufall == 1 || zufall == 8) {
            recievedMessage.react("😉");
            recievedMessage.channel.send(recievedMessage.author.toString() + ": Immer wieder gerne!");
        } else if (zufall == 2 || zufall == 7) {
            recievedMessage.react("😊");
            recievedMessage.channel.send(recievedMessage.author.toString() + ": Kein Stress!");
        } else if (zufall == 3 || zufall == 6) {
            recievedMessage.react("😋");
            recievedMessage.channel.send(recievedMessage.author.toString() + ": Kein Problem!");
        } else {
            recievedMessage.react("😎");
            recievedMessage.channel.send(recievedMessage.author.toString() + ": Sehr gerne!");
        }
    } else if (primaryCommandErstesWort.toLowerCase() == "hilfe") {
        befehleCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "ruw") {
        ruwCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "professor") {
        profCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "lernziele") {
        lernzieleCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "voraussetzungen") {
        voraussetzungenCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "semester") {
        semesterCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "vertiefungsbereich") {
        vertiefungCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "prüfungsleistungen") {
        pruefungsleistungenCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "turnus") {
        turnusCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "arbeitsaufwand") {
        arbeitsaufwandCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "dauer") {
        dauerCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "sprache") {
        spracheCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "plätze") {
        plaetzeCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "studon") {
        studonCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "anmeldung") {
        anmeldungCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "schnitt") {
        schnittCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "ects") {
        ectsCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "befehle") {
        befehleCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "rolle") {
        roleCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "kicke") {
        kickCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "mute") {
        muteCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "interessensbereich") {
        interestCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "kommentare") {
        kommentCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "kommentar") {
        kommentwCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "rating") {
        ratingCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "evaluation") {
        evaCommand(arguments, recievedMessage)
    } else if (primaryCommandErstesWort.toLowerCase() == "inhalt") {
        inhaltCommand(arguments, recievedMessage)
    }
    else {
        recievedMessage.channel.send("Error 0815, Befehl nicht gefunden. 💩\n**'!Hilfe'** oder **'!Befehle'** für Hilfe!")
    }
}

function inhaltCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn den Inhalt wissen? Schreibe **Inhalt Modulname**";
    } else {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (arguments[j].toLowerCase() == alleModule[i].modulbezeichnung.toLowerCase()) {
                    antwort += alleModule[i].selfInhalt();
                    mo = true;
                }
            }
        }
        if (!mo) {
            antwort += "Leider konnte ich mindestens eines dieser Module nicht finden."
        }
    }
    recievedMessage.channel.send(antwort);
}

function evaCommand(arguments, recievedMessage) {
}

function vertiefungCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du wissen, welchem Vertiefungsbereich ein bestimmtes Modul zugeordnet ist? Dann"
                + " schreibe **Vertiefungsbereich Modulname**.\nMöchtest du eine Auflistung aller Vertiefungsmodule "
                + "eines bestimmten Vertiefungsbereichs? Dann schreibe **Vertiefungsbereich WI/Sozök/BWL/VWL/interdisziplinär**";
    } else if (arguments.length > 1) {
        antwort += "Bitte immer nur ein Befehl auf einmal! **Vertiefungsbereich Modulname/WI/Sozök/BWL/VWL/interdisziplinär**";
    } else {
        var sachen = ["wi", "wirtschaftsinformatik", "vwl", "bwl", "inter", "interdisziplinär", "sozök", "sozialökonomie"];
        mo = false;
        if (sachen.includes(arguments[0].toLowerCase())) {
            antwort += "Vertiefungsmodule im Vertiefungsbereich " + arguments[0] + ":\n";
            mo = true;
            for (j = 0; j < sachen.length; j++) {
                for (i = 0; i < alleModule.length; i++) {
                    if (arguments[0].toLowerCase() == sachen[j]) {
                        if (alleModule[i].verwendbarkeit_Vertiefungsbereich.includes(sachen[j])) {
                            antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        }
                    }
                }
            }
        } else {
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                    mo = true;
                    antwort += "Das Modul gehört zum Vertiefungsbereich: " + alleModule[i].verwendbarkeit_Vertiefungsbereich.toString();
                }
            }
        }
        if (!mo) {
            antwort += "Leider konnte ich weder ein Modul noch einen Vertiefungsbereich mit diesem Namen finden."
        }
    }
    recievedMessage.channel.send(antwort);
}

function lernzieleCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn die Lernziele wissen? Schreibe **Lernziele Modulname**";
    } else if (arguments.length > 1) {
        antwort += "Bitte immer nur ein Befehl auf einmal! **Lernziele Modulname**";
    } else {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                mo = true;
                antwort += alleModule[i].selfLernziele();
            }
        }
        if (!mo) {
            antwort += "Ich konnte leider kein Modul mit diesem Namen finden.";
        }
    }
    recievedMessage.channel.send(antwort);
}

function ruwCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du zu einem Modul dessen RUW wissen? Dann schreibe **RUW Modulname**.\nHast "
                + "du hingegen die RUW-Nummer eines Moduls und möchtest dessen Namen wissen? Dann schreibe **RUW Nummer**";
    } else if (arguments.length == 1) {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].ruw == Number(arguments[0])) {
                mo = true;
                antwort += "Der Name des Moduls ist: " + alleModule[i].modulbezeichnung;
            } else if (arguments[0].toLowerCase() == alleModule[i].modulbezeichnung.toLowerCase()) {
                mo = true;
                antwort += alleModule[i].selfRUW();
            }
        }
        if (!mo) {
            antwort += "Ich konnte leider kein Modul finden, zu dem diese RUW-Nummer oder Name passt."
        }
    } else {
        antwort += "Bitte immer nur ein Befehl auf einmal! **RUW Modulname/Nummer**"
    }
    recievedMessage.channel.send(antwort);
}

function profCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du zu einem bestimmten Modul den Professor wissen? Dann schreibe **Professor Modulname**. "
                + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. "
                + "ZB.: **Managing_Technological_Change**\nOder hast du einen lieblings-Professor und möchtest eine Liste "
                + "aller seiner Module haben? Dann schreibe **Professor Name**.";
    } else {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (arguments[j].toLowerCase() == alleModule[i].modulverantwortlicher.toLowerCase() 
                    || arguments[j].toLowerCase() == alleModule[i].lehrende.toLowerCase()) {
                    mo = true;
                    antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                } else if (arguments[j].toLowerCase() == alleModule[i].modulbezeichnung.toLowerCase()) {
                    mo = true;
                    antwort += alleModule[i].selfModulverantwortlicher() + "\n" + alleModule[i].selfLehrende() + "\n";
                }
            }
        }
        if (!mo) {
            antwort += "Ich konnte leider weder ein Modul, noch einen Professor mit diesem Namen finden. Bitte beachte,"
                    + " dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. ZB.:"
                    + " **Managing_Technological_Change**"
        }
    }
    recievedMessage.channel.send(antwort);
}

function semesterCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du wissen, in welchem Regelstudiensemester ein bestimmtes Modul eingeplant ist? Dann"
                + " schreibe **Semester Modulname**.\nMöchtest du eine Auflistung aller Module, die in einem bestimmten "
                + "Regelstudiensemester eingeplant sind? Dann schreibe **Semester Zahl(1-6)**.";
    } else {
        if (!isNaN(Number(arguments[0]))) {
            if (arguments[0] < 1 || arguments[0] > 5) {
                antwort += "Es gibt 6 Regelstudiensemester, deshalb muss die Semesterzahl zwischen 1 und 6 liegen!";
            } else {
                mo = false;
                antwort += "Im Semester " + arguments[0].toString() + " sind folgende Module eingeplant: \n";
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].semesterzahl == arguments[0]) {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                    }
                }
                if (!mo) {
                    antwort += "Da ist wohl etwas schief gelaufen! Die Semesterzahl muss eine **Ganzzahl** "
                            + "sein und im Bereich von **1-6** liegen."
                }
            }
        } else {
            mo = false;
            for (i = 0; i < alleModule.length; i++) {
                for (j = 0; j < alleModule.length; j++) {
                    if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                        antwort += alleModule[i].selfRegelstudiensemester() + "\n";
                        mo = true;
                    }
                }
            }
            if (!mo) {
                antwort += "Leider konnte ich kein Modul mit diesem Namen finden."
            }
        }
    }
    recievedMessage.channel.send(antwort);
}

function voraussetzungenCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn die Voraussetzungen wissen? Schreibe **Voraussetzungen Modulname**. "
                + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. "
                + "ZB.: **Managing_Technological_Change**\nMöchtest du eine Auflistung aller Module, für die es keine "
                + "Voraussetzungen braucht, dann schreibe **Voraussetzungen Keine**";
    } else if (arguments[0].toLowerCase() != "keine") {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                    antwort += "- " + alleModule[i].selfVoraussetzungen() + "\n";
                    mo = true;
                }
            }
        }
        if (!mo) {
            antwort += "Leider konnte ich kein Modul mit diesem Namen finden."
        }
    } else {
        antwort += "Für die folgenden Module brauchst du keine Voraussetzungen erfüllen:\n";
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].voraussetzungen == "Keine") {
                antwort += "- " + alleModule[i].selfVoraussetzungen() + "\n";
            }
        }
    }
    recievedMessage.channel.send(antwort);
}

function interestCommand(arguments, recievedMessage) {  
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Gebe bitte nach **Interessensbereich** einfach eins oder mehrere Schlagwörter ein und ich "
                + "suche dir Module heraus, die diesem Interessensbereich entsprechen!\n**Interessensbereich "
                + "Schlagwort1 ... SchlagwortN**";
    } else {
        antwort += "Module, zu denen diese Schlagworte passen, sind:\n"
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].inhalt.includes(arguments[j])) {
                    antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                    mo = true;
                }
            }
        }
        if (!mo) {
            antwort += "Leider konnte ich keine Module finden, die zu diesen Schlagworten passen. "
                    + "Probiere es doch nochmal mit einem oder mehreren neuen Schlagworten aus!"
        }
    }
    recievedMessage.channel.send(antwort);
}

function pruefungsleistungenCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du zu einem bestimmten Modul wissen, welche Prüfungsleistungen du dafür belegen musst? "
                + "Dann schreibe **Prüfungsleistungen Modulname**. Bitte beachte, dass Modulnamen, die aus "
                + "mehreren Worten bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**\n "
                + "Bevorzugst du eine bestimmte Prüfungleistung und möchtest eine Liste aller Module mit einer derartigen "
                + "Prüfungsleistung haben? Dann schreibe **Prüfungsleistung Hausarbeit/Vortrag/Klausur**";
    } else if (arguments.length > 1) {
        antwort += "Bitte immer nur ein Befehl auf einmal. **Prüfungsleistungen Modulname/Hausarbeit/Vortrag/Klausur** "
                + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. "
                + "ZB.: **Managing_Technological_Change**"
    } else {
        if (arguments[0].toLowerCase() == "hausarbeit" || arguments[0].toLowerCase() == "klausur" 
            || arguments[0].toLowerCase() == "vortrag") {
            antwort += "Module mit dieser Prüfungsleistung sind:\n";
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].pruefungsleistungen.includes(arguments[0].toLowerCase())) {
                    antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                }
            }
        } else {
            mo = false;
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                    antwort += alleModule[i].selfPruefungsleistungen();
                    mo = true;
                }
            }
            if (!mo) {
                antwort += "Ein Modul mit diesem Namen konnte ich leider nicht finden."
            }
        }
    }
    recievedMessage.channel.send(antwort);
}

function arbeitsaufwandCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul wüsstest du denn gerne den Arbeitsaufwand? Schreibe **Arbeitsaufwand Modulname**.\n"
                + "Möchtest du deinen Arbeitsaufwand möglichst gering halten und nach modulen mit einer "
                + "Obergrenze an Arbeitsstunden suchen? Dann schreibe **Arbeitsaufwand Stunden(Zahl)**";
    } else {
        if (arguments.length > 1) {
            antwort += "Bitte immer nur ein Befehl auf einmal. **Arbeitsaufwand Modulname/Zahl**"
        } else {
            if (!isNaN(Number(arguments[0]))) {
                antwort += "Module mit einem maximalen Aufwand von " + arguments[0].toString() + " Stunden sind:\n";
                mo = false;
                for (i = 0; i < alleModule.length; i++) {
                    if ((alleModule[i].arbeitsaufwand[0] + alleModule[i].arbeitsaufwand[1]) <= arguments[0]) {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        mo = true;
                    }
                }
                if (!mo) {
                    antwort += "Leider kann ich keine Module finden, die nur einen so geringen Aufwand benötigen."
                }
            } else {
                mo = false;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                        mo = true;
                        antwort += alleModule[i].selfArbeitsaufwand();
                    }
                }
                if (!mo) {
                    antwort += "Leider konnte ich kein Modul mit diesem Namen finden."
                }
            }
        }
    }
    recievedMessage.channel.send(antwort);
}


function dauerCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du wissen, welche Dauer ein Modul hat? Dann schreibe **Dauer Modulname** "
                + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft "
                + "werden müssen. ZB.: **Managing_Technological_Change**\n Oder möchtest du eine Liste aller "
                + "Module haben, die in Blockseminaren gehalten werden? Dann schreibe **Dauer Blockseminar**.\n"
                + "Wenn du eine Liste aller Module haben willst, die über eine bestimmte Anzahl Semester dauern, "
                + "dann schreibe **Dauer Zahl**";
    } else {
        if (arguments.length > 1) {
            antwort += "Bitte immer nur ein Befehl auf einmal. **Dauer Modulname/Blockseminar/Zahl** Bitte beachte, "
            + "dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. ZB.: "
            + "**Managing_Technological_Change**"
        } else {
            if (!isNaN(Number(arguments[0]))) { //wenn es eine Nummer ist
                antwort += "Module mit einer Dauer von " + arguments[0] + " Semestern sind:\n";
                zaehler = 0;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].dauer[0] == arguments[0] && alleModule[i].dauer[1] == 's') {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        zaehler++;
                    }
                }
                if (zaehler == 0) {
                    antwort += "Es gibt keine Module mit dieser Dauer."
                }
            } else if (arguments[0].toLowerCase() == "blockseminar") {
                antwort += "Module, die als Blockseminare angeboten werden, sind:\n";
                zaehler = 0;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].dauer[1] == 'b') {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        zaehler++;
                    }
                }
                if (zaehler == 0) {
                    antwort += "Leider fine ich momentan keine Module, die als Blockseminar angeboten werden."
                }
            } else {
                mo = false;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                        antwort += alleModule[i].selfDauer();
                        mo = true;
                    }
                }
                if (!mo) {
                    antwort += "Leider finde ich kein Modul mit diesem Namen. Probiere es doch nochmal!"
                    + " **Dauer Modulname/Blockseminar/Zahl** Bitte beachte, dass Modulnamen, die aus mehreren "
                    + "Worten bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**"
                }
            }
        }
    }
    recievedMessage.channel.send(antwort);
}


function spracheCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du zu einem bestimmten Modul wissen, was dessen Vorlesungssprache ist? Dann "
                + "schtreibe **Sprache Modulname**\nMöchtest du hingegen eine Liste aller Module bekommen, "
                + "die in einer bestimmten Sprache gehalten werden (zum Beispiel englisch), "
                + "dann schreibe **Sprache englisch**";
    } else if (arguments.length > 1) {
        antwort += "Bitte immer nur ein Modul pder eine Sprache auf einmal!"
    } else {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                antwort += alleModule[i].selfSprache() + "\n";
                mo = true;
            }

        }
        if (!mo) {
            if (arguments[0].toLowerCase() == "deutsch" || arguments[0].toLowerCase() == "englisch") {
                antwort += "Folgende Module gibt es in der Sprache " + arguments[0] + ":\n";
                zaehler = 0;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].sprache == arguments[0]) {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        zaehler++;
                    }

                }
                if (zaehler == 0) {
                    antwort += "Es gibt keine Module, die in dieser Sprache gehalten werden."
                }
            } else {
                antwort += "Leider konnte ich kein Modul mit diesem Namen oder kein Modul, das "
                        + "in dieser Sprache gehalten wird finden."
            }
        }
    }
    recievedMessage.channel.send(antwort);
}

function schnittCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du die Durchschnittsnote eines bestimmten Moduls wissen? Dann schreibe "
                + "**Schnitt Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen "
                + "mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**\nMöchtest "
                + "du alle Module, die einen bestimmten Schnitt haben? Beispielsweise einen Schnitt besser als 2.0? "
                + "Dann schreibe **Schnitt 2.0**";
    } else {
        if (!isNaN(Number(arguments[0]))) {
            if (arguments[0] > 5.0 || arguments[0] < 1.0) {
                antwort += "Die Durchschnittsnote eines Moduls kann nur im Bereich zwischen 1.0 und 5.0 liegen!";
            } else {
                antwort += "Module, die einen Schnitt von " + arguments[0] + " oder besser haben sind:\n"
                zaehler = 0;
                for (i = 0; i < alleModule.length; i++) {
                    if (alleModule[i].schnitt <= arguments[0]) {
                        antwort += "- " + alleModule[i].modulbezeichnung + "\n";
                        zaehler++;
                    }
                }
                if (zaehler == 0) {
                    antwort += "Es gibt leider keine Module mit so einem Schnitt."
                }
            }
        } else {
            var mod = false;
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                    mod = true;
                    antwort += alleModule[i].selfSchnitt() + "\n";
                }
            }
            if (!mod) {
                antwort += "Das Modul habe ich leider nicht gefunden. Probiere es doch nochmal!\n"
                + "**Schnitt Modulname/Zahl** Bitte beachte, dass Modulnamen, die aus mehreren Worten "
                + "bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**"
            }
        }

    }
    recievedMessage.channel.send(antwort);
}


function studonCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn den StudOn Link bekommen?\nSchreibe **StudOn Modulname** "
        + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. "
        + "ZB.: **Managing_Technological_Change**";
    } else {
        var mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                    mo = true;
                    antwort += alleModule[i].selfStudon() + "\n";
                }
            }
        }
        if (!mo) {
            antwort += "Mindestens eines dieser Module konnte ich leider nicht finden. Probiere es "
            + "doch nochmal! **StudOn Modulname** Bitte beachte, dass Modulnamen, die aus mehreren "
            + "Worten bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
        }
    }
    recievedMessage.channel.send(antwort);
}


function anmeldungCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn den Anmeldungs Link bekommen?\nSchreibe "
        + "**Anmeldung Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen "
        + "mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
    } else {
        var mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                    mo = true;
                    antwort += alleModule[i].selfAnmeldung() + "\n";
                }
            }
        }
        if (!mo) {
            antwort += "Mindestens eines dieser Module konnte ich leider nicht finden. Probiere es doch "
            + "nochmal! **Anmeldung Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten "
            + "bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
        }
    }
    recievedMessage.channel.send(antwort);
}


function plaetzeCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn die Anzahl der zu vergebenden Plätze wissen? \n "
        + "Schreibe: **Plätze Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen "
        + "mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
    } else {
        var mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                    mo = true;
                    antwort += alleModule[i].selfPlaetze() + "\n";
                }
            }
        }
        if (!mo) {
            antwort += "Mindestens eines dieser Module konnte ich leider nicht finden. Probiere es doch nochmal! "
            + "**Plätze Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ "
            + "verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
        }
    }
    recievedMessage.channel.send(antwort);
}



function ratingCommand(arguments, recievedMessage) { //hier noch nach modjulen mit einer bestimmten rating
    var antwort = recievedMessage.author.toString() + ":\n";
    var mod = false;
    if (arguments == 0) {
        antwort += "Möchtest du wissen, wie ein Modul von deinen Studienkollegen gerated wurde? Dann schreibe "
        + "**Rating Modulname**\nOder willst du ein Modul bewerten? Dann schreibe **Rating Modulname Zahl(1-5)** "
        + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. ZB.: "
        + "**Managing_Technological_Change**\nIch kann dir auch eine Auflistung aller Module mit einem bestimmten Rating"
        + "(oder besser) geben. Schreibe dazu **Rating Zahl**";
    } else if (arguments.length == 1) {
        if (!isNaN(Number(arguments[0]))) {
            if (arguments[0] > 5 || arguments[0] < 1) {
                recievedMessage.channel.send(recievedMessage.author.toString() + 
                                            "\nRatings müssen im Bereich zwischen 1 und 5 sein.");
                return;
            }
            antwort += "Module mit einem Rating von " + arguments[0].toString() + " oder besser sind:\n";
            mod = false;
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].rating <= arguments[0]) {
                    antwort += "- " + alleModule[i].selfRating() + " \n";
                    mod = true;
                }
            }
            if (!mod) {
                antwort += "Leider konnte ich keine Module mit so einem Rating finden.";
            }
        } else {
            mod = false;
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                    antwort += alleModule[i].selfRating() + " von 5";
                    mod = true;
                }
            }
            if (!mod) {
                antwort += "Dieses Modul kenne ich leider nicht.";
            }
        }
    } else if (arguments.length == 2 && (arguments[1] == 1 || arguments[1] == 2 
                || arguments[1] == 3 || arguments[1] == 4 || arguments[1] == 5)) {
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                antwort += "Du hast das Modul erfolgreich bewertet! Danke Dir!💖";
                recievedMessage.react("👍");
                mod = true;
                alleModule[i].rating[0] = ((alleModule[i].rating[0] * alleModule[i].rating[1]) 
                                            + arguments[1] * 1) / (alleModule[i].rating[1] + 1);
                alleModule[i].rating[1] += 1;
            }
        }
        if (!mod) {
            antwort += "Dieses Modul kenne ich leider nicht.";
        }
    } else {
        antwort += "Dann erkläre ich dir das nochmal: **Rating Modulname Zahl(1-5)** und nicht mehr oder weniger!"
    }
    recievedMessage.channel.send(antwort);
}

function kommentwCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    var modulbekanntt = false;
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn Kommentare schreiben?\nSchreibe "
                + "**Kommentar Modulname Kommentar** Bitte beachte, dass Modulnamen, die "
                + "aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. ZB.: "
                + "**Managing_Technological_Change**";
        recievedMessage.channel.send(antwort);
        return;
    } else if (arguments.length > 1) {
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[0].toLowerCase()) {
                arguments.shift();
                var oneargument = arguments.join(" ");
                modulbekanntt = true;
                alleModule[i].kommentare.push(oneargument);
            }
        }
    } else {
        antwort += "Du musst schon auch einen Kommentar schreiben!\n**Kommentar Modulname KOMMENTAR**";
        recievedMessage.channel.send(antwort);
        return;
    }
    if (!modulbekanntt) {
        antwort += "Dieses Modul kenne ich leider nicht. Probiere es doch nochmal!\n "
                + "**Kommentar Modulname Kommentar** Bitte beachte, dass Modulnamen, die aus mehreren "
                + "Worten bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
    } else {
        antwort += "Dein Kommentar wurde erfolgreich eingetragen! Vielen Dank! 💖"
        recievedMessage.react("👍");
    }
    recievedMessage.channel.send(antwort);
}


function kommentCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    var modulbekanntz = false;
    if (arguments == 0) {
        antwort += "Zu welchem Modul möchtest du denn Kommentare sehen?\nSchreibe"
                + " **Kommentare Modulname** Bitte beachte, dass Modulnamen, die aus mehreren Worten "
                + "bestehen mit einem _ verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
        recievedMessage.channel.send(antwort);
        return;
    } else {
        for (i = 0; i < alleModule.length; i++) {
            if (arguments.includes(alleModule[i].modulbezeichnung)) {
                antwort += alleModule[i].selfKommentare();
                modulbekanntz = true;
            }
        }
    }
    if (!modulbekanntz) {
        antwort += "Dieses Modul kenne ich leider nicht. Probiere es doch nochmal!\n **Kommentare Modulname** "
                + "Bitte beachte, dass Modulnamen, die aus mehreren Worten bestehen mit einem _ "
                + "verknüpft werden müssen. ZB.: **Managing_Technological_Change**";
    }
    recievedMessage.channel.send(antwort);
}



function kickCommand(arguments, recievedMessage) {
}

function oneArray(arguments) {
    var antwort = "";
    for (i = 0; i < arguments.length; i++) {
        antwort += arguments[i] + " ";
    }
    return antwort;
}


function roleCommand(recievedMessage){
}


function befehleCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ", die folgenden Befehle kann ich ausführen:\n";
    antwort += "- Anmeldung\n"
        + "- Arbeitsaufwand\n"
        + "- Befehle\n"
        + "- Dauer\n"
        + "- ECTS\n"
        + "- Hilfe\n"
        + "- Inhalt\n"
        + "- Interessensbereich\n"
        + "- *Kicke\n"
        + "- Kommentar"
        + "\n- Kommentare"
        + "\n- Lernziele"
        + "\n- *Mute und Unmute"
        + "\n- Plätze"
        + "\n- Professor"
        + "\n- Prüfungsleistungen"
        + "\n- Rating"
        + "\n- *Rolle"
        + "\n- RUW"
        + "\n- Schnitt"
        + "\n- Semester"
        + "\n- Sprache"
        + "\n- StudOn"
        + "\n- Turnus"
        + "\n- Vertiefungsbereich"
        + "\n- Voraussetzungen";
    antwort += "\nDamit ich weiß, dass du deine Befehle an mich richtest kannst du mich entweder "
            + "mit **@Alfred** an mich wenden, oder den Befehl mit einem **!** beginnen.\nBitte beachte,"
            + " dass Modulnamen, die aus mehreren Worten bestehen mit einem _ verknüpft werden müssen. "
            + "ZB.: **Managing_Technological_Change**"
    recievedMessage.channel.send(antwort);

}


function ectsCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n";
    if (arguments == 0) {
        antwort += "Möchtest du zu einem bestimmten Modul die verdienten ECTS wissen? Dann schreibe: "
                + "**!ECTS Modulname**.\nMöchtest du hingegen alle Module des Studiengangs Wiwi wissen, die eine "
                + "bestimmte Anzahl an ECTS bringen, dann schreibe: **!ECTS Zahl**"
    } else {
        if (arguments[0] == '2,5' || arguments[0] == '2.5' || arguments[0] == '5' 
            || arguments[0] == '10' || arguments[0] == '15') {
            var zwischenAntwort = "";
            var zaehler = 0;
            for (i = 0; i < alleModule.length; i++) {
                if (alleModule[i].ects == arguments[0]) {
                    zwischenAntwort += "- " + alleModule[i].modulbezeichnung.toString() + "\n";
                    zaehler++;
                }
            }
            antwort += "Es gibt " + zaehler.toString() + " Module mit " + arguments[0].toString() + " ECTS:\n" 
                    + zwischenAntwort;
        } else {
            var modulbekannt = false;
            for (var i = 0; i < alleModule.length; i++) {
                if (arguments.includes(alleModule[i].modulbezeichnung)) {
                    modulbekannt = true;
                    antwort += alleModule[i].modulbezeichnung + " " + alleModule[i].selfEcts() + "\n";
                }
            }
            if (!modulbekannt) {
                antwort += "Dieses Modul konnte ich leider nicht finden oder es gibt keine Module "
                        + "mit dieser Anzahl ECTS. ☠"
            }
        }
    }
    recievedMessage.channel.send(antwort);
}

function turnusCommand(arguments, recievedMessage) {
    var antwort = recievedMessage.author.toString() + ":\n"
    if (arguments == 0) {
        antwort += "Falls du wissen möchtest, in welchem Turnus ein bestimmtes Modul angeboten wird, "
                + "dann schreibe **Turnus Modulname**.\n Möchtest du hingegen eine Auflistung aller Module, "
                + "die in einem bestimmten Turnus angeboten werden, dann schreibe **Turnus Sommersemester/Wintersemester**"
    } else if (arguments.includes("sommersemester") || arguments.includes("Sommersemester") 
                || arguments.includes("SS") || arguments.includes("ss")) {
        antwort += "Die folgenden Module finden im Sommersemester statt:\n"
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].turnus.includes("ss")) {
                antwort += (" - " + alleModule[i].modulbezeichnung + "\n");
            }
        }
    } else if (arguments.includes("wintersemester") || arguments.includes("Wintersemester") 
                || arguments.includes("ws") || arguments.includes("WS")) {
        antwort += "Die folgenden Module finden im Wintersemester statt:\n"
        for (i = 0; i < alleModule.length; i++) {
            if (alleModule[i].turnus.includes("ws")) {
                antwort += (" - " + alleModule[i].modulbezeichnung + "\n");
            }
        }
    } else {
        mo = false;
        for (i = 0; i < alleModule.length; i++) {
            for (j = 0; j < arguments.length; j++) {
                if (alleModule[i].modulbezeichnung.toLowerCase() == arguments[j].toLowerCase()) {
                    antwort += alleModule[i].selfTurnus() + "\n";
                    mo = true;
                }
            }
        }
        if (!mo) {
            antwort += "Diesen Turnus oder ein Modul mit diesem Namen konnt ich leider nicht finden.";
        }
    }
    recievedMessage.channel.send(antwort);
}


//----------------------------------------Module--------------------------------------

class WisoModul {
    constructor(modulbezeichnung, ruw, lehrveranstaltungen, lehrende, modulverantwortlicher, inhalt, 
        lernziele, voraussetzungen, semesterzahl,
        verwendbarkeit_Vertiefungsbereich, pruefungsleistungen, turnus,
        arbeitsaufwand, dauer, sprache, plaetze, studon, anmeldung, schnitt, ects, rating, kommentare) {
        this.modulbezeichnung = modulbezeichnung;
        this.ruw = ruw;
        this.lehrveranstaltungen = lehrveranstaltungen;
        this.lehrende = lehrende;
        this.modulverantwortlicher = modulverantwortlicher;
        this.inhalt = inhalt;
        this.lernziele = lernziele;
        this.voraussetzungen = voraussetzungen;
        this.semesterzahl = semesterzahl;
        this.verwendbarkeit_Vertiefungsbereich = verwendbarkeit_Vertiefungsbereich;
        this.pruefungsleistungen = pruefungsleistungen;
        this.turnus = turnus;
        this.arbeitsaufwand = arbeitsaufwand;
        this.dauer = dauer;
        this.sprache = sprache;
        this.plaetze = plaetze;
        this.studon = studon
        this.anmeldung = anmeldung;
        this.schnitt = schnitt;
        this.ects = ects;
        this.rating = rating;
        this.kommentare = kommentare;
    }

    selfKommentare() {
        var antwort = "Kommentare für " + this.modulbezeichnung + ": \n\n";
        var zahler = 1;
        for (i = 0; i < this.kommentare.length; i++) {
            antwort += "**Student " + zahler.toString() + ":** " + this.kommentare[i] + "\n\n";
            zahler++;
        }
        return antwort;
    }

    selfRating() {
        return "Rating für " + this.modulbezeichnung + ": Note " + this.rating[0];
    }

    selfModulbezeichnung() {
        return "Modulbezeichnung: " + this.modulbezeichnung;
    }
    selfRUW() {
        return "RUW-" + this.ruw;
    }
    selfLehrveranstaltungen() {
        return "Lehrveranstaltungen: " + this.lehrveranstaltungen.toString();
    }
    selfLehrende() {
        return "Lehrende: " + this.lehrende.toString();
    }
    selfModulverantwortlicher() {
        return "Modulverantwortlicher: " + this.modulverantwortlicher;
    }
    selfInhalt() {
        return "**Inhalt des Moduls " + this.modulbezeichnung + ":**\n " + this.inhalt;
    }
    selfSchlagwoerter(schlagwort) {
        if (this.inhalt.includes(schlagwort)) {
            return true;
        } else {
            return false;
        }
    }
    selfLernziele() {
        return "Lernziele des Moduls " + this.modulbezeichnung + ": \n" + this.lernziele;
    }
    selfVoraussetzungen() {
        return "Voraussetzungen: " + this.voraussetzungen.toString();
    }
    selfRegelstudiensemester() {
        return "Bei Regelstudienzeit eingeplant im " + this.semesterzahl.toString() + ". Semester";
    }
    selfVertiefungsbereich() {
        var a = "";
        if (this.verwendbarkeit_Vertiefungsbereich == 0) {
            a += "Nicht verwendbar als Vertiefungsmodul.";
        } else {
            a += "Verwendbar als Vertiefungsmodul im Bereich: " 
                + this.verwendbarkeit_Vertiefungsbereich.toString() + ".";
        }
        return a;
    }
    selfPruefungsleistungen() {
        return "Prüfungsleistungen: " + this.pruefungsleistungen.toString();
    }
    selfTurnus() {
        if (this.turnus.includes("ws") && this.turnus.includes("ss")) {
            return this.modulbezeichnung 
                    + " kann sowohl im Sommersemester, als auch im Wintersemester belegt werden.";
        }
        if (this.turnus.includes("ws")) {
            return this.modulbezeichnung + " kann nur im Wintersemester belegt werden."; 
        }//beide können es hier nicht mehr sein
        else {
            return this.modulbezeichnung + " kann nur im Sommersemester belegt werden."; 
        }//kann hier nur noch ss sein
    }
    selfArbeitsaufwand() {
        var a = 0;
        if (this.arbeitsaufwand.length > 1) a = this.arbeitsaufwand[1];
        return this.modulbezeichnung + " hat einen Arbeitsaufwand von " + this.arbeitsaufwand[0] 
            + " Stunden Präsenzzeit und " + a.toString() + " Stunden Eigenstudium.";
    }
    selfDauer() {
        var a = "";
        if (this.dauer[1] == "s") {
            a = " Semestern";
        } else {
            a = " Tagen";
        }
        return this.modulbezeichnung + " hat eine Dauer von " + this.dauer[0].toString() + a + ".";
    }
    selfSprache() {
        return "Modulsprache/n des Moduls " + this.modulbezeichnung + ": " + this.sprache + ".";
    }
    selfPlaetze() {
        if (this.plaetze == -1) return ("Das Modul " + this.modulbezeichnung + " hat keine beschränkte Anzahl an Plätzen.");
        return this.modulbezeichnung + " ist auf " + this.plaetze.toString() + " Plätze beschränkt."
    }
    selfStudon() {
        if (this.studon == "-") return ("Für das Modul " + this.modulbezeichnung + " ist leider kein StudOn Link hinterlegt.");
        return "StudOn Link des Moduls " + this.modulbezeichnung + ": " + this.studon;
    }
    selfAnmeldung() {
        if (this.studon == "-") return ("Für das Modul " + this.modulbezeichnung + " ist leider kein Anmeldungslink hinterlegt.");
        return "Anmeldungslink des Moduls " + this.modulbezeichnung + ": " + this.studon;
    }
    selfSchnitt() {
        if (this.schnitt == 100) return "Zu dem Modul " + this.modulbezeichnung + " ist keine Durchschnittsnote hinterlegt."
        return "Nach Angaben aus dem SS 2018 hat " + this.modulbezeichnung 
                + " eine Durchschnittsnote von " + this.schnitt.toString() + ".\nAngabe ohne Gewähr."
    }
    selfEcts() {
        return "ECTS: " + this.ects.toString();
    }
    selfPresentation() {
        return "- " + this.selfModulbezeichnung() + "\n\n"
            + "- " + this.selfRUW() + "\n\n"
            + "- " + this.selfLehrveranstaltungen() + "\n\n"
            + "- " + this.selfLehrende() + "\n\n"
            + "- " + this.selfModulverantwortlicher() + "\n\n"
            + "- " + this.selfInhalt() + "\n\n"
            + "- " + this.selfLernziele() + "\n\n"
            + "- " + this.selfVoraussetzungen() + "\n\n"
            + "- " + this.selfRegelstudiensemester() + "\n\n"
            + "- " + this.selfVertiefungsbereich() + "\n\n"
            + "- " + this.selfPruefungsleistungen() + "\n\n"
            + "- " + this.selfTurnus() + "\n\n"
            + "- " + this.selfArbeitsaufwand() + "\n\n"
            + "- " + this.selfDauer() + "\n\n"
            + "- " + this.selfSprache() + "\n\n"
            + "- " + this.selfPlaetze() + "\n\n"
            + "- " + this.selfStudon() + "\n\n"
            + "- " + this.selfAnmeldung() + "\n\n"
            + "- " + this.selfSchnitt() + "\n\n"
            ;
    }
}

let unternehmensplanspielUNSplit = "Folgende betriebswirtschaftliche Themenkomplexe werden mit Hilfe einer computergestützten Simulation behandelt: \n-- Administration: Denken in betriebswirtschaftlichen Alternativen, Marktsituationen und Marktergebnisse richtig interpretieren und in zielorientierte Entscheidungen umsetzen \n-- Beschaffung und Lagerhaltung: Berechnung optimaler Bestellmengen \n-- Produktion: Investitions- und Desinvestitionsentscheidungen, Auslastungsplanung, Personalplanung \n-- Vertrieb: Analyse der Markt- und Wettbewerbssituation, Planung der Marketingausgaben, Analyse der Marktforschungsberichte, Festlegung der Preispolitik \n-- Finanzen: Finanzplanung, Gewinn- und Verlustrechnung, Bilanzanalyse \n-- Studierende lösen in Gruppenarbeiten ein reales Unternehmensproblem";
unternehmensplanspiel = new WisoModul("Unternehmensplanspiel", 2030, "V: Unternehmensplanspiel (4SWS)", "Amberg", "Amberg", unternehmensplanspielUNSplit, "Die Studierenden lernen \n-- komplexe betriebswirtschaftliche Zusammenhänge spielerisch zu erkennen und zu analysieren, \n-- Marktsituationen und Marktergebnisse richtig zu interpretieren und in zielorientierte Entscheidungen umzusetzen, \n-- Strategien an Ziele zu koppeln und in Entscheidungen umzusetzen, \n-- Zusammenhänge zwischen Entscheidungsbereichen zu erkennen und Entscheidungen zu koordinieren, \n-- Teamarbeit und Organisation zu verbessern.", ["Keine"], 1, [], ["klausur", "vortrag"], ["ws", "ss"], [30, 120], [3, "d"], ["deutsch"], -1, "-", "-", 1.93, 5, [2.5, 1], ["gut zum Leute kennenlernen im ersten Semester", "in 3 Tagen geschafft, geht schon"]);
alleModule.push(unternehmensplanspiel);

let agilProjMan = new WisoModul("Agiles_Projektmanagement", 3286, "", "Rössler", "Gardini", "Das Seminar vermittelt Scrum als agiles Framework zum Management von Projekten und betrachtet seine Anwendung im interkulturellen Kontext Lateinamerika", "Die Studierenden\n- erwerben fundierte Kenntnisse über politische Prozesse, ökonomische Veränderungen und gesellschaftliche Herausforderungen im Kontext von Globalisierungs- und Integrationsprozessen.\n- entwickeln die Fähigkeit, die Dynamik interner und externer Faktoren zu analysieren und zu bewerten.", "Erfolgreicher Abschluss der Assessmentphase", 4, ["sozök"], ["hausarbeit"], ["ws", "ss"], [30, 120], [1, "s"], ["deutsch"], -1, "-", "-", 100, 5, [2.5, 1], ["ist in ordnung", "sehr interessant und lehrreich"]);
alleModule.push(agilProjMan);

let arbeitsrecht = new WisoModul("Arbeitsrecht_1", 3651, "", "Begründung und Inhalt von Arbeitsverhältnissen", "Holzer-Thieser und Andreas Beulmann", "Hoffmann", "Die Studierenden\n- erwerben fundierte Kenntnisse über die Begründung und die Ausgestaltung von Arbeitsverhältnissen, Arbeitnehmer- und Arbeitgeberpflichten, sowie über Fragen zu Gleichbehandlung, Befristung von Arbeitsverhältnissen, Urlaubsansprüchen und zur Entgeltfortzahlung im Krankheitsfall.\n- werden in die wissenschaftliche Beschäftigung mit arbeitsrechtlichen Fragestellungen eingeführt und auf eine spätere berufliche Tätigkeit vorbereitet.\n- erlernen anhand von Fallbeispielen die arbeitsrechtliche Rechtsprechung und können diese analysieren, beurteilen und fallspezifisch umsetzen.\n- entwickeln die Fähigkeit, arbeitsrechtliche Fragestellungen in der Praxis (z.B. in den Bereichen Personalwesen, Wirtschaftspädagogik, Sozialökonomik) selbstständig zu erörtern und zu lösen.", "Erfolgreicher Abschluss der Assessmentphase", 4, ["sozök"], ["klausur"], ["ws"], [45, 105], [1, "s"], ["deutsch"], -1, "-", "-", 3.9, 5, 3.9, ["viel zu schwer", "mega schlechter schnitt"]);
alleModule.push(arbeitsrecht);

let datenermittlung = new WisoModul("Datenermittlung", 3150, "", "Wildner", "Wildner", "- Vermittlung wissenschaftlicher und praktischer Grundlagen zur Erhebung empirischer Daten\n- Darstellung qualitativer / quantitativer Erhebungsmethoden, insb. Beobachtung, Befragung usw. sowie Einmal- und Panelstudien\n- Vertiefung der Methode der Befragung durch Grundlagen der Fragebogengestaltung, Einführung in die Klassische Testtheorie mit den Gütekriterien Reliabilität und Validität\n- Darstellung verschiedener Stichprobenverfahren:\n- Zufalls- und Quotenauswahl / bewusste Auswahlverfahren\n- einfache Zufallsauswahl\n- allgemeine zweistufige Zufallsauswahl\n- Clusterstichproben\n- geschichtete Stichproben und deren Optimierung\n- Vorstellung von Hochrechungsverfahren und Gewichtung", "Die Studierenden\n- erwerben anwendungsbezogene Grundlagen von empirischen Erhebungsmethoden.\n- erhalten eine Einführung in die Fragebogengestaltung und allgemeine Konzeption von Erhebungen.\n- erlernen die Bestimmung der Stichprobentheorie und deren Übertragung auf unterschiedliche Stichprobenverfahren.n- können aus Stichproben Parameter hochrechnen.\n- bestimmen wie man wo, wann, auf welche Weise und zu welchen Kosten an benötigte Daten gelangt sowie welche Fallstricke und Schwächen die Datenerhebung birgt.", "Erfolgreicher Abschluss der Assessmentphase\n- Vorherige Teilnahme an der Veranstaltung 'Statistik'", 4, ["bwl"], ["klausur"], ["ss"], [60, 90], [1, "s"], ["deutsch"], -1, "-", "-", 1.86, 5, 1.86, ["viel Mathe aber macht spaß", "easy eine gute note geholt!!"]);
alleModule.push(datenermittlung);

let beschaffungsmanagement = new WisoModul("Beschaffungsmanagement", 4270, "", "Voigt", "Voigt", "Die Beschaffung in Industrieunternehmen nimmt gerade aufgrund der stetigen Verringerung der Wertschöpfungstiefe an Bedeutung zu. Die Zusammenarbeit mit Lieferanten rückt in den Vordergrund der Betrachtung und es gilt, diese gezielt zu managen. Das Ziel der Veranstaltung ist es zu zeigen, wodurch die Beschaffung von Industrieunternehmen gekennzeichnet ist und wie eine erfolgreiche Lieferanten-Abnehmer-Beziehung ausgestaltet werden soll. Neben einem allgemeinen theoretischen Teil, der insbesondere die theoretischen Grundlagen, die Bestimmungsgrößen, die organisationalen Rahmenbedingungen, die Organisationsformen der Beschaffung und der strategischen Beschaffungsplanung behandelt, müssen die Teilnehmer in Gruppenarbeit selbständig wissenschaftliche Themen des Beschaffungsmanagements erarbeiten, präsentieren und diskutieren", "Die Studierenden verfügen über umfassendes und detailliertes Wissen über das Beschaffungsmanagement. Ausgehend von den wichtigsten aktuellen Entwicklung im Beschaffungsmanagement, können sie die organisationalen und umweltspezifischen Bestimmungsgrößen, die auf das Beschaffungsmanagement einwirken, selbstständig erkennen und erläutern. Außerdem verfügen die Studierenden detaillierte Kenntnisse über Methoden und Werkzeuge zur Bestimmung strategischer Alternativen im Beschaffungsmanagement, wie z.B. die grundsätzliche Frage von Make-or-buy-Entscheidungen, die Auswahl von Sourcing Strategien oder die Priorisierung unterschiedlicher Güterklassen. Die Studierenden können mit Hilfe dieser Informationen strategische Fragestellungen des Beschaffungsmanagements beurteilen, Handlungsempfehlungen abgeben und mögliche Ansätze auch kritisch hinterfragen. Daneben analysieren die Studierenden in Gruppenarbeit aktuelle Fragestellungen aus dem Beschaffungsmanagement. Die nötige Literatur müssen sich die Studierenden anhand wissenschaftlicher Veröffentlichungen innerhalb einer Literaturrecherche selbst suchen, evaluieren und strukturieren. Die Ergebnisse werden dann während der Veranstaltung präsentiert, wobei eine anschließende Diskussion (im Rahmen von selbst verfassten Thesen), sowohl inhaltlich als auch methodisch, ausdrücklich vorgesehen ist. Die Ergebnisse der Diskussion sollen dann direkt in die weitere Ausarbeitung der Fragestellung mit einfließen", "Erfolgreicher Abschluss der Assessmentphase", 4, ["bwl"], ["vortrag", "klausur"], ["ws"], [30, 120], [1, "s"], ["deutsch"], 80, "-", "Kein Link hinterlegt, Anmeldezeitraum: erste Woche im Vorlesungszeitraum im WiSe", 1.85, 5, 1.85, ["klassisches BWL Modul"]);
alleModule.push(beschaffungsmanagement);

let personalökonomik = new WisoModul("Grundlagen_der_Personalökonomik", 6590, ["Vorlesung", "Übung"], "Stephan", "Stephan", "Zentrale Aufgaben des Personalmanagements sind aus personalökonomischer Sicht die effiziente Allokation von Ressourcen und die optimale Ausgestaltung von Anreizen innerhalb des Unternehmens – kurz Koordination und Motivation. Die Veranstaltung behandelt aus dieser Perspektive unter anderem die folgenden Themen: Qualifikationsanforderungen, befristete und unbefristete Arbeitsverträge, Selbstselektion von Bewerberinnen und Berwerbern, Weiterbildungsinvestitionen, Entlassungen und Kündigungen, optimale Kompensationspakete, Team- und Gruppenanreize, Personalbeurteilung, Beförderungen und „Turniere“, Effizienzlöhne, Motive der Leistungserbringung.", "Die Studierenden\n- kennen wichtige Konzepte und Modelle der Personalökonomik,\n- übertragen ihre modelltheoretischen Kenntnisse auf neue Fragestellungen,\n- können die Bedeutung der Ausgestaltung von Arbeitsverträgen und Kompensationspaketen erklären,\n- interpretieren empirische Studien personalökonomischer Fragestellungen.", "Grundkenntnisse in Mikroökonomik und Arbeitsmarktökonomik", 5, ["vwl"], ["klausur"], ["ws"], [45, 105], [1, "s"], ["deutsch"], -1, "-", "-", 2.68, 5, 2.68, ["Lieblings Prof! Modul ist La-La"]);
alleModule.push(personalökonomik);

let iWirtschaft = new WisoModul("Internationale_Wirtschaft ", 2392, ["Vorlesung", "Übung"], "Merkl und Moser", "Merkl und Moser", "- Zahlen und Fakten zum Welthandel\n- Grundlegende Handelstheorien und deren Implikationen\n- Wechselkurse und deren Rolle\n- Internationale makroökonomische Politik", "Die Studierenden\n- bekommen einen Einblick in Welthandelsbeziehungen und können Zusammenhänge zwischen Konjunkturpolitik, Leistungsbilanzen und Wechselkursen erläutern.\n- erwerben Kenntnisse über Ursachen und Auswirkungen des internationalen Handels und können Zusammenhänge, etwa die Auswirkungen wirtschaftspolitischer Maßnahmen auf die Wechselkursentwicklung, beurteilen.\n- Sind in der Lage Ergebnisse zu interpretieren und mit Hilfe graphischer Modellen zu visualisieren", "Makroökonomie", 3, ["vwl"], ["klausur"], ["ws"], [60, 90], [1, "s"], ["deutsch", "englisch"], -1, "-", "-", 2.67, 5, 2.67, []);
alleModule.push(iWirtschaft);

let mtc = new WisoModul("Managing_Technological_Change", 3442, ["Vorlesung", "Übung"], "Amberg und Mitarbeitende", "Amberg", "Die Fähigkeit einer Organisation, die Bedürfnisse des Marktes mit den Potentialen neuer Technologien schnell und effizient abzugleichen und in die eigenen Produkte und Prozesse zu integrieren, ist eine wesentliche Voraussetzung für Unternehmenserfolg.\nIn der Vorlesung werden den Studierenden umfassende Grundlagen über Motivation, Ziele, Aufgaben, Prozesse und Methoden des Technologiemanagements ermittelt.\n- Einordnung/Abgrenzung des Technologiemanagements\n- Notwendige Unternehmensprozesse und -strukturen\n- Entwicklung von Technologiestrategien\n- Technologieanalyse und -früherkennung\n- Technologieplanung und -entwicklung\n- Technologieverwertung und Technologieschutz\n- Bewertung von Technologien\n- Anwendungen in der Praxis\nIn der Übung wenden die Studierenden die Methoden des Technologiemanagements am Beispiel spezifischer Fragestellungen an und stellen die, in Gruppen erarbeiteten, Ergebnisse im Rahmen einer Präsentation vor. Zu den Präsentationen geben sich die Studierenden gegenseitig wertschätzendes Feedback.", "Die Studierenden kennen und verstehen Konzepte und Methoden des Technologiemanagements und können diese praktisch anwenden zur:\n- Früherkennung neuer Trends, Entwicklungen und Technologien\n- Bewertung und Priorisierung neuer Technologien\n- Integration/Umsetzung neuer Technologien in Produkten und Prozessen\nBei der praktischen Anwendung von Methoden des Technologiemanagements im Rahmen der Übung werden die entwickelten Ansätze mit den Studierenden diskutiert und weiterentwickelt.", "Erfolgreicher Abschluss der Assessmentphase", 4, ["wi"], ["klausur", "vortrag"], ["ss"], [60, 90], [1, "s"], ["deutsch"], -1, "-", "-", 1.42, 5, 1.42, ["Easy ne gute Note und faire Klausur ;D", "netter lehrstuhl"]);
alleModule.push(mtc);

let mps = new WisoModul("Managing_Projects_Successfully", 3441, ["Vorlesung", "Übung"], "Amberg und Mitarbeitende", "Amberg", "Eine Vielzahl der Tätigkeiten in Unternehmen wird heutzutage in Projekten abgewickelt. Die Erreichung gesetzter Ziele bei gegebenen Mitteln und Terminen ist eine anspruchsvolle Aufgabe.\nIn der Vorlesung werden den Studierenden umfassende Grundlagen über Motivation, Ziele, Aufgaben, Prozesse und Methoden des Projektmanagements vermittelt.\n- Einfluss von Organisation und Umfeld auf Projekte\n- Zielkonflikte in Projekten\n- Ablauf/Phasen von Projekten\n- Initiierung/Definition von Projekten\n- Planung und Durchführung von Projekten\n Monitoring und Controlling von Projekten\n- Abschluss und Evaluation von Projekten\n- Behandlung von Risiken in Projekten\n- Anwendungen in der Praxis (Gastvorträge)\nIn der Übung wenden die Studierenden die Methoden des Projektmanagements am Beispiel konkreter Projekte an und stellen die, in Gruppen erarbeiteten, Projektpläne im Rahmen einer Präsentation vor. Zu den Präsentationen geben sich die Studierenden gegenseitig wertschätzendes Feedback.", "Die Studierenden kennen und verstehen Konzepte und Methoden des Projektmanagements und können diese praktisch anwenden zur:\n- Initiierung von Projekten\n- Planung von Projekten\n- Durchführung von Projekten\n- Steuerung von Projekten\nBei der praktischen Anwendung von Methoden des Projektmanagements im Rahmen der Übung werden die entwickelten Ansätze mit den Studierenden diskutiert und weiterentwickelt", "Erfolgreicher Abschluss der Assessmentphase", 5, ["wi"], ["klausur", "vortrag"], ["ws"], [60, 90], [1, "s"], ["deutsch"], -1, "-", "-", 2.16, 5, 2.16, []);
alleModule.push(mps);

let businessplanseminar = new WisoModul("Businessplanseminar", 2380, ["S: Business Plan Seminar (Blockseminar mit Anwesenheitspflicht)"], "Voigt", "Voigt", "Im Rahmen des Businessplanseminarseminars werden Geschäftsideen für eine potenzielle Unternehmensgründung gesammelt, ausgearbeitet, präsentiert und in Form eines detaillierten Businessplans beschrieben. Dazu erhalten die Studierenden kurze inhaltliche Erläuterungen zu den Zielsetzungen und Bestandteilen eines Businessplans. Zusätzlich dazu veranschaulichen Praxisvorträge von Unternehmensgründern oder Gründungsberatern die Relevanz des Businessplans für die unternehmerische Praxis.", "Die Studierenden arbeiten im Rahmen des Seminars in Arbeitsgruppen die wichtigsten Bestandteile eines Businessplans selbstständig aus. Zur Bearbeitung der einzelnen BusinessplanBestandteile verfügen die Studierenden über einschlägiges Wissen in angrenzenden Bereichen und sammeln, bewerten und interpretieren darüber hinaus Informationen eigenständig durch geeignete Recherche in Dokumenten, dem Internet und/oder empirischen Erhebungen.\nDie Studierenden sind in der Lage, einen Businessplan unter Berücksichtigung unterschiedlicher, thematischer Maßstäbe zu beurteilen. Der Aufbau des Seminars bedingt, dass die Studierenden fachliche Entwicklungen anderer Kommilitonen ebenfalls gezielt fördern, bereichsspezifische und -übergreifende Diskussionen führen sowie wertschätzendes Feedback auf die Zwischenpräsentationen der anderen Seminarteilnehmer geben.\nEine abschließende Präsentation und die Bewertung durch eine Fachjury sollen darüber hinaus dazu beitragen, die Kommunikations- und Präsentationsfähigkeiten der Studierenden zu schulen. Aus diesen Gründen herrscht Anwesenheitspflicht.", "Keine", 6, ["inter"], ["hausarbeit", "vortrag"], ["ss"], [30, 120], [3, "d"], ["deutsch"], -1, "-", "-", 100, 5, 2.5, []);
alleModule.push(businessplanseminar);

//paste bots secret token as parameter to login: client.login("token")
//paste token as string to client.login function
client.login("NjE4NDY3Mjk0ODc1NzQ2MzA0.XW6HCQ.udcX0NdJvJu6lrLJuSc9N4j3spE")