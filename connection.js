//connect to mongoDb
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Mongodb connected successfully...'))
.catch(err => console.log(err));

//library schema and model, comment schema and model
const librarySchema = new mongoose.Schema({
  title: 'String',
  commentcount: { type: 'Number', default: 0},
  comments: { type: 'Array', default: []}
});

const commentSchema = new mongoose.Schema({
  title: 'String',
  bookId: {
  type: mongoose.Schema.Types.ObjectId, ref: 'Library'
  }, 
  comment: 'String'
});

const Library = mongoose.model('Library', librarySchema);
const Comment = mongoose.model('Comment', commentSchema);

//post api/books
const postBook = async(req, res) => {
  const title = req.body.title;
  if (!title) {
    res.json('missing required field title');
  } else {
  const addBook = new Library({
    title: title
  })
  await addBook.save();
  res.json({ title: addBook.title, _id: addBook._id });
  }
};

//get api/books
const getBook = async (req, res) => {
  const mong = await Library.find()
  .then( async (data) => {
    const newArr = [];
    let comments = [];
    data.forEach( async (el) => {
    let comments = [];
      const newUserObj = { _id: el._id, title: el.title, commentcount: el.commentcount }
      newArr.push(newUserObj);
    });
    res.send(newArr);
  });
};

//delete /api/books
const deleteBook = async (req, res) => {
  const mong = await Library.find()
  .then(data => data);
  const deleteLib = await Library.deleteMany({});
  const deleteComment = await Comment.deleteMany({});
  if (deleteLib && deleteComment) {
    res.json('complete delete successful');
  }
};

//get /api/books/{_id}
const getBookWithId = async (req, res) => {
  const id = req.params.id;
   const book = await Library.findById(id);
  if (!book) {
    return res.json('no book exists');
  } 
  const findComment = await Comment.find({ bookId: book._id });
  let comments = [];
  findComment.forEach((el) => {
    comments.push(el.comment);
  });
  res.json({ comments: comments, title: book.title, _id: book._id, commentcount: findComment.length })

}

//post /api/books/{_id}
const postBookWithId = async (req, res) => {
  const { id, comment } = req.body;
  if (!id) {
    return res.json('missing id');
  }
  if (!comment) {
    return res.json('missing required field comment');
  }
  const book = await Library.findById(id);
  if (!book) {
    return res.json('no book exists');
  } 
  const addComment = new Comment({
    title: book.title,
    comment: comment,
    bookId: id
  });
  await addComment.save();
  
  const findComment = await Comment.find({ bookId: book._id });
  let comments = [];
  findComment.forEach((el) => {
    comments.push(el.comment);
  });
    
  const updateLibrary = await Library.findByIdAndUpdate(book._id,
     {
    commentcount: comments.length,
    comments: comments
  });
  await updateLibrary.save();
  console.log(updateLibrary);
  res.json({ comments: comments, title: addComment.title, _id: addComment._id, commentcount: comments.length })
};

//delete /api/books/{_id}
const deleteBookWithId = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json('missing id');
  }
  const mong = await Library.findById(id);
  if (!mong) {
    res.json('no book exists');
  } else {
    const deleteBook = await Library.findByIdAndDelete(mong._id);
    const deleteComment = await Comment.deleteMany({ bookId: id })
    res.json('delete successful');
  }
}


module.exports = {
getBook,
postBook,
deleteBook,
getBookWithId,
postBookWithId,
deleteBookWithId
};