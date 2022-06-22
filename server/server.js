const mongoose = require("mongoose")
const express = require("express")
const cors = require('cors')
const Document = require("./Document")
const app = express();

app.use(
  express.urlencoded({
      extended: true,
  })
)

app.use(express.json());

app.use(cors());

app.delete('/document/:id', async (req, res) => {

  const id = req.params.id;
  
  const document = Document.findOne({_id: id});
  if(!document) {
      res.status(422).json({error: 'Not Found'});
      return
  }

  try {
      
      await Document.deleteOne({_id: id})
      res.status(200).json({message: 'Success'})

  } catch (error) {
      res.status(500).json({ error: error})
  }

});

app.post('/document', async (req, res) => {
  const { id , data } = req.body;
  const doc = { 
    _id: id,
    data: JSON.parse(data)
  };
  try{
    await Document.create(doc);
    res.status(201).json({message: 'success'})
  }catch(error) {
    res.status(500).json({error: error})
  }

})


mongoose.connect("mongodb://127.0.0.1:27017/google-docs-clone", {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }).then(() => {
      console.log("Connected!")
      app.listen(8002)
      // console.log(app)
    }).catch((err) => {
      console.log(err)
    })
// mongoose.deleteModel

const io = require("socket.io")(3001, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  }
})

const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document)

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
      socket.broadcast.to(documentId).emit("typing-changes", { session_id: socket.id })

    })
    
    socket.on('send-cursor-changes', cursors => {
      socket.broadcast.to(documentId).emit("cursor-activity", { session_id: socket.id, cursors })
      console.log(cursors)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}