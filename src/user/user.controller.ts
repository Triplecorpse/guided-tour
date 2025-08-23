import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserProfileDto } from "./dto/user-profile.dto";
import { User } from "../iam/User";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ActiveUser } from "../iam/decorators/active-user.decorator";
import { UserPayload } from "../iam/types/UserPayload";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current user's profile" })
  @ApiResponse({
    status: 200,
    description: "Return the current user's profile",
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getCurrentUserProfile(
    @ActiveUser() activeUser: UserPayload,
  ): Promise<UserProfileDto> {
    const user = await this.userService.findOne(activeUser.sub!);

    // Map to UserProfileDto to exclude sensitive fields
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      isGoogleAuthenticationEnabled: !!user.googleId,
      isPasswordSet: !!user.password,
      isTFAEnabled: user.isTFAEnabled,
      role: user.role,
    };
  }

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
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
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
