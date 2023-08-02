const yaml = require('js-yaml')
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
require('dotenv').config();

const topic_map = process.env.TOPIC_MAP_DIR + '/' + process.env.TOPIC_MAP_FILE;

const docsDir = process.env.BASE_DIR + '/rosa/docs';

let currLevel = 0;
let topLevel = 'rosa'


// Function to delete the existing file if present
const deleteExistingFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        //console.log('Existing file deleted successfully.');
      } catch (err) {
        console.error('Error deleting the existing file:', err);
      }
    } 
  };

// Function to create a file and its parent directories recursively
const createFileWithDirectories = (filePath, content) => {
    // Extract the directory path from the file path
    const directoryPath = path.dirname(filePath);
  
    // Recursively create the parent directories
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directories:', err);
      } else {
        // Parent directories created successfully
        // Now, create the file and write content to it
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            console.error('Error creating the file:', err);
          } else {
            //console.log('File created and content written successfully.');
          }
        });
      }
    });
  };


try {
    let fileContents = fs.readFileSync(topic_map, 'utf8');
    let data = yaml.loadAll(fileContents);

    console.log("nav:");

    for (var topic of data)
    {
        processTopic(topic, topLevel);
    }


    //console.log(data);
} catch (e) {
    console.log(e);
}


function processTopic(topic, dir)
{
    currLevel++;

    if (topic.Dir)
    {
    
        console.log(' '.repeat(currLevel*2) + "- \"" + topic.Name + "\":")
        for (var subtopic of topic.Topics)
            processTopic(subtopic, dir + '/' + topic.Dir)

    }
    else
    {
        if (!topic.Distros ||  topic.Distros.includes(process.env.DISTRO) )
        {

            console.log(' '.repeat(currLevel*2) + "- \"" + topic.Name + "\": " + dir + "/" + topic.File + ".md")

            let fullFilespec = docsDir + "/" + dir + "/" + topic.File + ".md";

            //console.log(fullFilespec)
            deleteExistingFile(fullFilespec)

            createFileWithDirectories(fullFilespec, "# " + topic.Name + "\n\nBlah blah \n");
        }
    }

    currLevel--;
}