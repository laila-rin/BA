# Alfred - ein Chatbot zur Unterstüzuung von Studierenden bei ihrer Studiumsplanung

Dieses Programm ist im Rahmen der Bachelorarbeit zum Thema "Implementierung und Evaluation eines Chatbots zur Unterstützung von Studierenden bei ihrer Studiumsplanung und Modulauswahl im Studienfach Wirtschaftswissenschaften" der Friedrich-Alexander-Universität Erlangen-Nürnberg entstanden.

In der Bachelorarbeit wird die Konzeption und Implementierung eines Chatbots untersucht. Der Chatbot soll die Aufgaben eines Modulhandbuchs erfüllen und Studierenden bei der Modulauswahl helfen. 

Chatbot Alfred kann Usern anhand ausgewählter Kriterien eine Auswahl passender Module erstellen. Inhaltlich beschränkt sich der Bot auf Module des Studiengangs Wirtschaftswissenschaften mit den Schwerpunkten BWL, VWL und WI an der FAU. Primäre Vorteile des Chatbots sind die unkomplizierte Nutzung und Zeitersparnis bei der Modulauswahl für den User. 

Das Programm beschreibt den im Rahmer der Bachelorarbeit implementierten Chatbot, welcher auf der Plattform Discord betrieben wird. Um den Bot lokal betreiben zu können, bzw. um das Programm lokal erfolgreich ausführen zu können, müssen zuerst die in Punkt 1 folgenden Voraussetzungen gegeben sein. Außerdem muss ein eigener Bot über die Discord Weboberfläche erstellt werden, auf ein Tutorial hierzu wird in Punkt 2 verwiesen. Zuletzt müssen die in Punkt 3 beschriebenen Anpassungen am Quellcode vorgenommen werden.

Sind alle 3 Punkte erledigt, so kann der Chatbot Alfred erfolgreich betrieben werden!

### 1. Voraussetzungen

Voraussetzungen zum Deployment des Chatbots:

* Visual Studio Code
* Discord Account

### 2. Erstellen und Deployment eines Discord-Bots

Um den Chatbot zum Laufen zu bekommen muss zuerst eine Bot Applikation eingerichtet und dieser ein Bot hinzugefügt werden. Dies erfolgt über die Weboberfläche des Discord Developer Portals. Eine detailierte Erklärung findet sich hier: 
```
https://discordjs.guide/preparations/setting-up-a-bot-application.html
```
Nach Hinzufügen des Bots wird für diesen automatisch ein geheimer Token generiert, welcher im Folgenden noch genutzt wird.

### 3. Anpassung des Quellcodes

Der Quellcode muss an den folgenden Stellen angepasst werden:

#### Zeile 21: let generalChannel = client.channels.get("XXXX"). 

Statt der XXXX muss die ID des "general" Channels des Servers eingesetzt werden.
Diese kann aus der URL gelesen werden, es ist die letzte mehrstellige Zahl nach einem "/".
     
Die ID kann auch durch die Ausführung des folgenden Codeabschnitts im Bereich des ready-Events auf der Konsole ausgegeben werden. In der Ausgabe ist es die ID des general text:
```
client.guids.forEach((guild => {
   guild.channels.forEach((channel) => {
       console.log (` - ${channel.name) ${channel.type} ${channel.id}`)
   })
})
```
                                     
#### Zeile 1209: client.login("XXXX")

Hier muss der zuvor erwähnte Token eingefügt werden.
    
### Ausführen des Programms

Nach erfolgreicher Anpassung des Quellcodes kann das Programm in Visual Studio Code mit dem Befehl 
```
node alfred.js 
```
ausgeführt werden.

## Viel Spaß mit Alfred!
