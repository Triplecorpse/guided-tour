import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/User";
import { Repository } from "typeorm";
import { HashingService } from "../hashing.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(dto: SignUpDTO): Promise<boolean> {
    try {
      const user = new User();
      user.email = dto.email;
      user.password = await this.hashingService.hash(dto.password);

      await this.userRepository.save(user);
      return true;
    } catch (e) {
      const pgUniqueViolationErrorCode = "23505";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw e;
    }
  }

  async signIn(dto: SignInDTO): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException("User does not exist");
    }
    const isEqual = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException("Password not match");
    }
    return true;
  }
}
