// src/authors/authorsController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put,
    Delete,
    Query,
    Route,
    Request,
    SuccessResponse,
    TsoaResponse,
    Res,
    Security
  } from "tsoa";
  import { Author } from "./author";
  import { AuthorsService, AuthorCreationParams, AuthorUpdateParams } from "./authorsService";

  @Security("bearerAuth")
  @Security("basicAuth")
  @Route("authors")
  export class AuthorsController extends Controller {
    /**
     * Return all authors in the system
     */
    @Get("")
    public async getAuthors(@Request() _req: any): Promise<Author[]> {
       return new AuthorsService().all(_req.app.db);
    }

    /**
     * Get number of available authors
     */
    @Get("/count")
    public async count(@Request() _req: any): Promise<number> {
      return _req.app.db.data.authors.length;
    }

    /**
     * Get an author by name or id
     */
    @Get("{idOrName}")
    public async getAuthor(
      @Request() _req: any,
      @Path() idOrName: number|string
    ): Promise<Author> {
      return new AuthorsService().get(_req.app.db, idOrName);
    }

    /**
     * Find all authors with matching name. Partial matching is supported.
     */
    @Get("/find")
    public async findAuthor(
      @Request() _req: any,
      @Query() namePart?: string
    ): Promise<Author[]> {
      const found =  new AuthorsService().find(_req.app.db, ''+namePart);
      return found;
    }

    /**
     * Add a new author to the system
     */
    @Post()
    public async createAuthor(
        @Request() _req: any,
        @Body() requestBody: AuthorCreationParams,
        @Res() notFoundResponse: TsoaResponse<405, { errorMessage: string }>
    ): Promise<Author> {
      if(!requestBody.name) {
        return notFoundResponse(405, { errorMessage: `Author name should not be empty` });
      }
      if(!requestBody.age) {
        return notFoundResponse(405, { errorMessage: `Author age is 0` });
      }
      const found = new AuthorsService().get(_req.app.db,requestBody.name);
      if(found)
      {
        return notFoundResponse(405, { errorMessage: `Author already exists: ${found.name}` });
      }

      this.setStatus(200);
      return new AuthorsService().create(_req.app.db,requestBody);
    }

    /**
     * Update an author
     */
     @Put()
     public async updateAuthor(
         @Request() _req: any,
         @Body() requestBody: AuthorUpdateParams,
         @Res() notFoundResponse: TsoaResponse<405, { errorMessage: string }>
     ): Promise<Author> {
       const found = new AuthorsService().get(_req.app.db,requestBody.id);
       if(!found)
       {
         return notFoundResponse(405, { errorMessage: `Author not found by id: ${requestBody.id}` });
       }
       if(requestBody.name) {
        const foundByName = 
          new AuthorsService()
          .find(_req.app.db, requestBody.name)
          .filter((a)=>(a.id!=requestBody.id)&&(a.name==requestBody.name));
        if( foundByName.length ) {
          return notFoundResponse(405, { errorMessage: `Another author with same name already exists: ${requestBody.name}` });
        }
       }
 
       return new AuthorsService().update(_req.app.db,requestBody);
     }

    /**
     * Delete an author from the system
     */
    @SuccessResponse(200,"Deleted Successfully")
    @Delete("{id}")
    public async deleteAuthor(
      @Request() _req: any,
      @Path() id: number,
      @Res() notFoundResponse: TsoaResponse<405, { errorMessage: string }>
    ): Promise<void> {
      const errorMessage = new AuthorsService().delete(_req.app.db,id)
      if(errorMessage)
      {
        // Guess it is right code for failure: https://stackoverflow.com/questions/25122472/rest-http-status-code-if-delete-impossible
        return notFoundResponse(405, { errorMessage });
      }
    }

  }