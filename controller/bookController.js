const bookService = require("../services/bookService");
const { bookSchema } = require("../validations/bookValidation");
const constants = require("../constants/en");

const bookController = {
  createBook: async (req, res) => {
    let response = {};
    let data = req.body;
    let { title, genre, author, year } = data;
    const { error } = bookSchema.validate(req.body);
    if (error) {
      res.statusCode = constants.STATUS_CODE.BAD_REQUEST;
      response.message = constants.VALIDATION.FAILED;
      response.error = error.message;
      return res.json(response);
    }
    try {
      /**check if title is already exist */
      let checkTitle = await bookService.findOne({ title: title });

      if (checkTitle) {
        res.statusCode = constants.STATUS_CODE.CONFLICT;
        response.message = constants.BOOK.ALREADY_EXISTS;
        return res.json(response);
      }

      let insertData = {
        title: title,
        genre: genre,
        author: author,
        year: year,
      };
      const result = await bookService.createBook(insertData);
      if (!result) {
        res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
        response.message = constants.BOOK.BOOK_ADD_ERROR;
        return res.json(response);
      }

      res.statusCode = constants.STATUS_CODE.CREATED;
      response.message = constants.BOOK.CREATED;
      response.result = result;
      return res.json(response);
    } catch (error) {
      console.log(error);
      res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.message = constants.SERVER.ERROR;
      return res.json(response);
    }
  },

  updateBook: async (req, res) => {
    let response = {};
    let data = req.body;
    const bookId = req.params.id;

    const { title, genre, author, year } = data;

    // const { error } = bookSchema.validate(req.body);
    // if (error) {
    //   res.statusCode = constants.STATUS_CODE.BAD_REQUEST;
    //   response.message = constants.VALIDATION.FAILED;
    //   response.error = error.message;
    //   return res.json(response);
    // }

    try {
      // Check if the book exists
      const existingBook = await bookService.getBookById(bookId);
      if (!existingBook) {
        res.statusCode = constants.STATUS_CODE.NOT_FOUND;
        response.message = constants.BOOK.NOT_FOUND;
        return res.json(response);
      }

      /** If title is being updated, check if it's already taken by another book **/
      if (title && title !== existingBook.title) {
        const titleExists = await bookService.findOne({ title: title });
        if (titleExists) {
          res.statusCode = constants.STATUS_CODE.CONFLICT;
          response.message = constants.BOOK.ALREADY_EXISTS;
          return res.json(response);
        }
      }

      let updateEntity = {};
      if (title) {
        updateEntity.title = title;
      }
      if (genre) {
        updateEntity.genre = genre;
      }
      if (author) {
        updateEntity.genre = genre;
      }
      if (year) {
        updateEntity.genre = genre;
      }

      const updatedBook = await bookService.updateBook(bookId, updateEntity);
      if (!updatedBook) {
        res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
        response.message = constants.SERVER.ERROR;
        return res.json(response);
      }

      res.statusCode = constants.STATUS_CODE.OK;
      response.message = constants.BOOK.UPDATED;
      response.result = updatedBook;
      return res.json(response);
    } catch (error) {
      console.log(error);
      res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.message = constants.SERVER.ERROR;
      return res.json(response);
    }
  },

  getBook: async (req, res) => {
    let response = {};
    try {
      const book = await bookService.getBookById(req.params.id);

      if (!book) {
        res.statusCode = constants.STATUS_CODE.NOT_FOUND;
        response.message = constants.BOOK.NOT_FOUND;
        return res.json(response);
      }

      res.statusCode = constants.STATUS_CODE.OK;
      response.message = constants.BOOK.FETCHED;
      response.result = book;
      return res.json(response);
    } catch (error) {
      console.log(error);
      res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.message = constants.SERVER.ERROR;
      return res.json(response);
    }
  },

  getAllBooks: async (req, res) => {
    let response = {};
    try {
      const {
        limit = 10,
        offset = 0,
        title,
        author,
        orderBy = "createdAt",
        order = "desc",
      } = req.query;

      let params = {};
      if (title) {
        params.title = { $regex: title, $options: "i" };
      }
      if (author) {
        params.author = { $regex: author, $options: "i" };
      }

      let sort = {};
      sort[orderBy] = order === "asc" ? 1 : -1;

      const books = await bookService.getBooks({
        params,
        limit: parseInt(limit),
        offset: parseInt(offset),
        sort,
      });

      res.statusCode = constants.STATUS_CODE.OK;
      response.message = constants.BOOK.FETCHED;
      response.result = books;
      return res.json(response);
    } catch (error) {
      console.log(error);
      res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.message = constants.SERVER.ERROR;
      return res.json(response);
    }
  },

  deleteBook: async (req, res) => {
    let response = {};
    try {
      const book = await bookService.deleteBook(req.params.id);
      if (!book) {
        res.statusCode = constants.STATUS_CODE.NOT_FOUND;
        response.message = constants.BOOK.NOT_FOUND;
        return res.json(response);
      }

      res.statusCode = constants.STATUS_CODE.OK;
      response.message = constants.BOOK.DELETED;
      return res.json(response);
    } catch (error) {
      console.log(error);
      res.statusCode = constants.STATUS_CODE.INTERNAL_SERVER_ERROR;
      response.message = constants.SERVER.ERROR;
      return res.json(response);
    }
  },
};

module.exports = bookController;
