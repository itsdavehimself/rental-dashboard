using AutoMapper;
using server.DTOs;

public class PaymentProfile : Profile
{
  public PaymentProfile()
  {
    CreateMap<Payment, PaymentResponseDto>()
      .ForMember(
        dest => dest.CollectedBy,
        opt => opt.MapFrom(src => $"{src.CollectedBy.FirstName} {src.CollectedBy.LastName}")
      )
      .ForMember(
        dest => dest.EventUid,
        opt => opt.MapFrom(src => src.Event.Uid)
      );
  }
}