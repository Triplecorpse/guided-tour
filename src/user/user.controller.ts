import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "../iam/User";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User successfully created",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Return the user", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({
    status: 200,
    description: "User successfully updated",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "User successfully deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.userService.remove(+id);
  }
}
