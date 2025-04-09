import ResponseDto from '../response.dto';

export default interface EmailAuthResponseDto extends ResponseDto {
  isVerified: boolean;
}
