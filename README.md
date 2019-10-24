# Das Programm zur Bachelorarbeit:
## Implementierung und Evaluation eines Chatbots zur Unterstützung von Studierenden bei ihrer Studiumsplanung und Modulauswahl im Studienfach Wirtschaftswissenschaften

In der Bachelorarbeit wird die Herangehensweise an Konzeption und Implementierung eines Chatbots untersucht. Der Chatbot soll die Aufgaben eines Modulhandbuchs erfüllen und Studierenden bei der Modulauswahl helfen. Der Bot kann dem User anhand ausgewählter Kriterien eine Auswahl passender Module erstellen. Der Mehrwert des Chatbots resultiert aus der Unkompliziertheit und der Zeitersparnis für den User. 

### Voraussetzungen

Voraussetzungen zum Deployment des Chatbots:

```
Visual Studio Code
```
```
Discord Account
```

### Erstellen und Deployment eines Bots

Um den Chatbot zum Laufen zu bekommen muss zuerst eine Bot Applikation eingerichtet und dieser ein Bot hinzugefügt werden. Dies erfolgt über die Weboberfläche des Discord Developer Portals, eine detailierte Erklärung findet sich hier: 
```
https://discordjs.guide/preparations/setting-up-a-bot-application.html
```
Nach Hinzufügen des Bots wird für diesen automatisch ein geheimer Token generiert, welcher im späteren Verlauf noch genutzt wird.

### Anpassung des Quellcodes

Der Quellcode muss an den folgenden Stellen angepasst werden:

#### Zeile 21: let generalChannel = client.channels.get("XXXX"). 

Statt der XXXX muss die ID des generellen Servers eingesetzt werden.
Diese kann aus der URL gelesen werden, es ist die letzte mehrstellige Zahl nach einem /.
     
Oder durch die Ausführung des folgenden Codeabschnitts im Bereich des ready-Events auf der Konsole ausgegeben werden. Es ist die ID des general text:
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

Nach erfolgreicher Anpassung des Quellcodes kann das Programm mit dem Befehl 
```
node alfred.js 
```
ausgeführt werden.
