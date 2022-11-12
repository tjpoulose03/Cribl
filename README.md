
# Cribl Assessment

This api will provide the user with a list of log entries in chronological order for a sepcified file. Parameters can include the number of entries being returned back to the user and/or any tex/keywords to search by.

The fs module was used and as well as ReadStreams to read the file in chunks to accomadate for files >1GB. Feel free to add additional files to the ./var/log folder for further testing


## Run Locally

Clone the project

```bash
  git clone https://github.com/tjpoulose03/Cribl.git
```

Go to the project directory

```bash
  cd Cribl
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```
## Node Version

14.15.0


## API Reference

#### Get Logs

```http
  GET /getLogs
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fileName` | `string` | **Required**. Name of File |
|`latestLogs`|`string`| Last number of lines in the file|
|`searchString`|`string`| text/keyword that exists in the logs



## Usage/Examples
Example #1 :
```bash
curl --location --request GET 'localhost:4000/getLogs?fileName=log1.txt&latestLogs=3&searchString=Bye
```
Result :
```javascript
{
    "message": "Success",
    "data": [
        "Nov  7 03:57:33 LMCreditApp-Staging-External sshd[406779]: Received disconnect from 83.4.35.191 port 55958:11: Bye Bye [preauth]"
    ]
}
```
Example #2 :
```bash
curl --location --request GET 'localhost:4000/getLogs?fileName=log2.txt&latestLogs=3
```
Result :
```javascript
{
    "message": "Success",
    "data": [
        "03/22 08:54:35 TRACE  :......rsvp_event_mapSession: Session=9.67.116.",
        "03/22 08:54:24 TRACE  :.......mailslot_send: sending to (9.67.116.99:0)",
        "03/22 08:54:24 TRACE  :......rsvp_flow_stateMachine: reentering state RESVED"
    ]
}
```
Example #3 :
```bash
curl --location --request GET 'localhost:4000/getLogs?latestLogs=10
```
Result :
```javascript
{
    "message": "File Not Found",
    "data": false
}
```

