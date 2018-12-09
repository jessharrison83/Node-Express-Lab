// import your node modules
const express = require("express");
const db = require("./data/db.js");
const server = express();
const PORT = 5050;
// add your server code starting here

server.use(express.json());

server.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

server.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length !== 0) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

server.post("/api/posts", (req, res) => {
  const post = req.body;
  console.log(post);
  if (post.title && post.contents) {
    db.insert(post)
      .then(newID => {
        db.findById(newID.id).then(post => {
          res.status(201).json(post[0]);
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database."
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

server.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length !== 0) {
        const storedPost = post;
        db.remove(id).then(count => {
          if (count) {
            res.json(storedPost);
          } else {
            res.status(500).json({ error: "The post could not be removed" });
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

server.put("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  db.findById(id)
    .then(post => {
      if (post.length !== 0 && updated.title && updated.contents) {
        db.update(id, updated).then(count => {
          if (count) {
            db.findById(id).then(post => {
              res.status(200).json(post);
            });
          } else {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          }
        });
      } else if (post.length !== 0) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was a problem with your request." });
    });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
