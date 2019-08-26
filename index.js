const express = require("express");

const server = express();

server.use(express.json());

//Variable Init
const projects = [];
let requestCount = 0;

//MIDLEWARES
//Count and log all requests
function logRequests(req, res, next) {
  requestCount++;

  console.log(`Número de requisições: ${requestCount}`);

  return next();
}

//Call the fuction in every request
server.use(logRequests);

//Get the project from the URL
function getOneProject(req, res, next) {
  var project_index = undefined;

  const project = projects.find((element, index) => {
    if (element.id === req.params.id) {
      project_index = index;
      return element;
    }
  });

  if (!project) {
    return res
      .status(400)
      .json({ error: " The project does not exist in the array" });
  }

  req.project = project;
  req.project_index = project_index;

  return next();
}

//LANDING PAGE
server.get("/", (req, res) => {
  res.json({ message: "This is the landing page" });
});

//CRUD ROUTES

// POST /projects:
// Creates a new project in the array
//Template: { id: "1", title: 'Novo projeto', tasks: [] };
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });
  return res.json(projects);
});

// GET /projects: list all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//GET: list one project
server.get("/projects/:id", getOneProject, (req, res) => {
  return res.json(req.project);
});

// PUT /projects/:id: Chancge the title from on specific project
server.put("/projects/:id", getOneProject, (req, res) => {
  req.project.title = req.body.title;

  return res.json(projects);
});

// DELETE /projects/:id: Delete project
server.delete("/projects/:id", getOneProject, (req, res) => {
  projects.splice(req.project_index, 1);

  res.send("Item Deleted Sucessfully");
});

// POST /projects/:id/tasks: Creates Task
server.post("/projects/:id/tasks", getOneProject, (req, res) => {
  const { title } = req.body;

  projects[req.project_index].tasks.push(title);

  return res.json(projects);
});

//Initializing server in port 3000 (arbitrary decision, you can set it to any port you like)
server.listen(3000);
