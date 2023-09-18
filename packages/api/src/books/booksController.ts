// src/books/booksController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put,
    Query,
    Delete,
    Route,
    Request,
    Res,
    TsoaResponse,
    SuccessResponse,
    Security
  } from "tsoa";
  import { Book } from "./book";
  import { BooksService, BookCreationParams, BookUpdateParams } from "./booksService";
  import { AuthorsService } from "../authors/authorsService";
  import { GenresService } from "../genres/genresService";

  @Security("bearerAuth")
  @Security("basicAuth")
  @Route("books")
  export class BooksController extends Controller {
    /**
     * Return all books in the system
     */
    @Get("")
    public async getBooks(@Request() _req: any): Promise<Book[]> {
      return new BooksService().all(_req.db);
    }

    /**
     * Get number of available books
     */
    @Get("/count")
    public async count(@Request() _req: any): Promise<number> {
      return _req.db.data.books.length;
    }

    /**
     * Get a book by id or name or id
     */
    @Get("{idOrName}")
    public async getBook(
      @Request() _req: any,
      @Path() idOrName: number|string
    ): Promise<Book> {
      return new BooksService().get(_req.db, idOrName);
    }

    /**
     * Find all books with matching name. Partial matching is supported.
     */
    @Get("/find")
    public async findBook(
      @Request() _req: any,
      @Query() namePart?: string
    ): Promise<Book[]> {
      const found =  new BooksService().find(_req.db, ''+namePart);
      return found;
    }

    /**
     * Add a new book to the system
     */
    @SuccessResponse(200,"Created Successfully")
    @Post()
    public async createBook(
        @Request() _req: any,
        @Body() bookData: BookCreationParams,
        @Res() bookInvalidResponse: TsoaResponse<401, { errorMessage: string }>
    ): Promise<Book> {
      if(!bookData.name) {
        return bookInvalidResponse(401, { errorMessage: "Book name should not be empty" });
      }
      const found = new BooksService().find(_req.db,bookData.name);
      for(let ind in found) {
        const fb = found[ind];
        if(fb.name==bookData.name && fb.author==bookData.author) {
          return bookInvalidResponse(401, { errorMessage: "Book already exists:"+fb.id });
        }
      }

      if(!new AuthorsService().get(_req.db,bookData.author)) {
        return bookInvalidResponse(401, { errorMessage: "Author not found by id: "+bookData.author });
      }
      
      if(!new GenresService().get(_req.db,bookData.genre)) {
        return bookInvalidResponse(401, { errorMessage: "Genre not found by id: "+bookData.genre });  
      }

      return new BooksService().create(_req.db,bookData);
    }

    /**
     * Update a book the system
     */
     @Put()
     public async updateBook(
         @Request() _req: any,
         @Body() bookData: BookUpdateParams,
         @Res() bookInvalidResponse: TsoaResponse<401, { errorMessage: string }>
     ): Promise<Book> {
      if(!bookData.name) {
         return bookInvalidResponse(401, { errorMessage: "Book name should not be empty" });
      }
      const found = new BooksService().get(_req.db,bookData.id);
      if(!found) {
        return bookInvalidResponse(401, { errorMessage: "Book not found by id:"+bookData.id });
      }
 
      if(bookData.author) {
        if(!new AuthorsService().get(_req.db,bookData.author)) {
          return bookInvalidResponse(401, { errorMessage: "Author not found by id: "+bookData.author });
        } 
      }
      if(bookData.genre) {
        if(!new GenresService().get(_req.db,bookData.genre)) {
          return bookInvalidResponse(401, { errorMessage: "Genre not found by id: "+bookData.genre });  
        }
      }      

      return new BooksService().update(_req.db,bookData);
    }
 

    /**
     * Delete a book from the system
     */
    @SuccessResponse(200,"Deleted Successfully")
    @Delete("{id}")
    public async deleteBook(
      @Request() _req: any,
      @Path() id: number,
      @Res() notFoundResponse: TsoaResponse<405, { errorMessage: string }>
    ): Promise<void> {
      if(! new BooksService().delete(_req.db,id) )
      {
        // Guess it is right code for failure: https://stackoverflow.com/questions/25122472/rest-http-status-code-if-delete-impossible
        return notFoundResponse(405, { errorMessage: "Book with this ID not found in the database" });
      }
    }
  }