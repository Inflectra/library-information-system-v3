// src/genres/genresController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    SuccessResponse,
    Request,
    TsoaResponse,
    Delete,
    Res,
    Security
  } from "tsoa";
  import { Genre } from "./genre";
  import { GenresService, GenreCreationParams } from "./genresService";

  @Security("bearerAuth")
  @Security("basicAuth")
  @Route("genres")
  export class GenresController extends Controller {
    /**
     * Return all genres in the system
     */
     @Get("")
    public async getGenres(@Request() _req: any): Promise<Genre[]> {
      return new GenresService().all(_req.db);
    }

    /**
     * Get number of available genres
     */
     @Get("/count")
    public async count(@Request() _req: any): Promise<number> {
      return _req.db.data.genres.length;
    }

    /**
     * Get a genre by name or id
     */
     @Get("{idOrName}")
    public async getGenre(
      @Request() _req: any,
      @Path() idOrName: number|string
    ): Promise<Genre> {
      return new GenresService().get(_req.db, idOrName);
    }

    /**
     * Add a new genre to the system
     */
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createGenre(
        @Request() _req: any,
        @Body() requestBody: GenreCreationParams
    ): Promise<Genre> {
      this.setStatus(201); // set return status 201
      const genre = new GenresService().create(_req.db,requestBody);
      return genre;
    }


    /**
     * Delete a genre from the system
     */
    @SuccessResponse(200,"Deleted Successfully")
    @Delete("{id}")
    public async deleteGenre(
      @Request() _req: any,
      @Path() id: number,
      @Res() notFoundResponse: TsoaResponse<405, { errorMessage: string }>
    ): Promise<void> {
      const errorMessage = new GenresService().delete(_req.db,id)
      if(errorMessage)
      {
        // Guess it is right code for failure: https://stackoverflow.com/questions/25122472/rest-http-status-code-if-delete-impossible
        return notFoundResponse(405, { errorMessage });
      }
    }
  }