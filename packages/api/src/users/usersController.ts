// src/users/usersController.ts
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    SuccessResponse,
    Request,
    Security,
    Query,
    Res,
    TsoaResponse
  } from "tsoa";
  import {User} from "./user";
  import {UsersService} from "./usersService";

  @Route("users")
  export class UsersController extends Controller {

    /**
     * Start new session
     * @param username login name (unless you specify it as basic authorization)
     * @param password password (unless pass it as basic authorization)
     * @returns 
     */
    @Security("basicAuth")
    @Get("login")
    public async login(
      @Request() _req: any,
      @Res() loginFailedResponse: TsoaResponse<401, { errorMessage: string }>,
      @Query() username?: string,
      @Query() password?: string
    ): Promise<User&{token:string}> {
      const authUser:User = <User>_req.user;
      const res = new UsersService().login(_req.db, username||authUser.username, password||authUser.password);
      if(res) {
        return res;
      } else {
        return loginFailedResponse(401, { errorMessage: "Unable to login" });
      }
    }

    /**
     * Keep current session. If anything but 200 is returned, current session is over (or token is expired).
     */
    @Security("bearerAuth")
    @Get("keepalive")
    public async keepAlive(
      @Request() _req: any
    ): Promise<boolean> {
      return true;
    }

    /**
     * End current session
     */
    @Security("bearerAuth")
    @Get("logout")
    public async logout(
      @Request() _req: any
    ): Promise<boolean> {
      const res = new UsersService().logout(_req.token);
      return res;
    }

    /**
     * Get all users in the system
     */
    @Security("bearerAuth")
    @Security("basicAuth")
    @Get("")
    public async getUsers(@Request() _req: any): Promise<User[]> {
      return new UsersService().all(_req.db);
    }

    /**
     * Get organization Id for this API
     */
    @Get("org")
    public async getOrg(@Request() _req: any): Promise<string> {
      return _req.clientId;
    }

    /**
     * Quick test. Check that endpoint is alive. No auth required.
     */
     @Get("test")
    public async selfTest(@Request() _req: any): Promise<string> {
      return "LIS 3.0 API Test Succeeded";
    }

    /**
     * Get user by name
     */
    @Security("bearerAuth")
    @Security("basicAuth")
    @Get("{username}")
    public async getUser(
      @Request() _req: any,
      @Path() username: string
    ): Promise<User> {
      return new UsersService().get(_req.db, username);
    }

    /**
     * Create a new user
     * @param _req 
     * @param requestBody 
     */
    @Security("bearerAuth")
    @Security("basicAuth")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Request() _req: any,
      @Body() requestBody: User,
      @Res() createFailedResponse: TsoaResponse<401, { errorMessage: string }>
    ): Promise<User|boolean> {
      this.setStatus(201); // set return status 201
      const res = new UsersService().create(_req.db,requestBody);
      if(!res) {
        return createFailedResponse(401,{errorMessage:"User not found"});        
      }
      return res;  
    }


    /**
     * Update information about user (anything except username)
     * @param requestBody 
     */
    @Security("bearerAuth")
    @Security("basicAuth")
    @Post("/update")
    public async updateUser(
      @Request() _req: any,
      @Body() requestBody: Partial<User>&Pick<User,"username">,
      @Res() updateFailedResponse: TsoaResponse<401, { errorMessage: string }>
    ): Promise<User|boolean> {

      const res= new UsersService().update(_req.db,requestBody);
      if(!res) {
        return updateFailedResponse(401,{errorMessage:"User not found"});
      }
      return res;  
    }

  }