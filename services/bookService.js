const Book = require("./../models/book");

const bookService = {
  getBookById: async (id) => {
    try {
      return await Book.findById(id);
    } catch (error) {
      console.error("getBookById error:", error);
      return null;
    }
  },

  findOne: async (data) => {
    try {
      let result = await Book.findOne(data);
      return result || false;
    } catch (error) {
      console.error("getBook error:", error);
    }
  },

  createBook: async (data) => {
    try {
      const book = new Book(data);
      return await book.save();
    } catch (error) {
      console.error("createBook error:", error);
      return null;
    }
  },

  updateBook: async (id, data) => {
    try {
      return await Book.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      console.error("updateBook error:", error);
      return null;
    }
  },

  deleteBook: async (id) => {
    try {
      return await Book.findByIdAndDelete(id);
    } catch (error) {
      console.error("deleteBook error:", error);
      return null;
    }
  },

  getBooks: async ({ params, limit, offset, sort }) => {
    try {
      offset = parseInt(offset, 10);
      limit = parseInt(limit, 10);

      if (isNaN(offset) || offset < 0) offset = 0;
      if (isNaN(limit) || limit <= 0) limit = 10;

      let result = await Book.find(params).sort(sort).skip(offset).limit(limit);

      let totalCount = await Book.countDocuments(params);

      if (result.length > 0) {
        return { books: result, totalCount };
      } else {
        return { books: [], totalCount: 0 };
      }
    } catch (err) {
      console.log("Error in getBooks service:", err);
      return null;
    }
  },
};

module.exports = bookService;
