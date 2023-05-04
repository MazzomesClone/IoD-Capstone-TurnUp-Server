# IoD Capstone Project - TurnUp Server
<h4>This repository contains the files necessary to run the backend server for the TurnUp client</h4>
<p>In order to run this server locally, follow these instructions:<p>
  
<p><strong>1. </strong>Download the MongoDB community server msi installer package for your operating system from here:</br>
https://www.mongodb.com/try/download/community</br>
Then, install MongoDB by running the msi installer</p>

<p><strong>2. </strong>Clone the repository, <code>cd</code> into the root folder and run <code>npm install</code> to install the required dependencies.</p>

<p><strong>3. </strong>Run <code>npm run start</code> to start the server. This will run the server at <code>http://localhost:3000/</code> by default.</br>
You may navigate to that url and verify the server is listening. If so, you will see <code>{"message":"Welcome to TurnUp"}</code> in your browser.</p>

<p><strong>Hooray! </strong>Now that the server and MongoDB service is running, the TurnUp server is ready to accept requests.</br>
To load the demonstrational TurnUp data to MongoDB, continue following these instructions:</p>

<p><strong>4. </strong>Install the MongoDB database tools by finding and following <strong>all</strong> the instructions for your operating system here:</br>
 https://www.mongodb.com/docs/database-tools/installation/installation/</p>
 
<p><strong>5. </strong>Once the MongoDB database tools are installed, open your operating systems' command prompt and <code>cd</code> to the root directory of the cloned repository.</p>

<p><strong>6. </strong>In this directory run <code>mongorestore</code></br>
This wil load the test data from the "dump" folder.</p>

<p><strong>You are now ready to use the TurnUp server!</strong></p>
