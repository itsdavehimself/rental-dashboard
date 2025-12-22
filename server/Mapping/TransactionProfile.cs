using AutoMapper;
using server.DTOs;

public class TransactionProfile : Profile
{
  public TransactionProfile()
  {
    CreateMap<Transaction, TransactionResponseDto>()
      .ForMember(
        dest => dest.ProcessedBy,
        opt => opt.MapFrom(src => $"{src.ProcessedBy.FirstName} {src.ProcessedBy.LastName}")
      )
      .ForMember(
        dest => dest.EventUid,
        opt => opt.MapFrom(src => src.Event.Uid)
      );
  }
}