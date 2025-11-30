using AutoMapper;
using server.Models.Event;
using server.DTOs.Event;
using server.DTOs;

public class EventProfile : Profile
{
  public EventProfile()
  {
    CreateMap<Event, EventResponseDto>();

    CreateMap<EventItem, EventItemResponseDto>()
      .ForMember(dest => dest.Description,
                opt => opt.MapFrom(src => src.InventoryItem != null 
                    ? src.InventoryItem.Description 
                    : ""));

    CreateMap<LogisticsTask, LogisticsTaskResponseDto>();

    CreateMap<Discount, DiscountResponseDto>();

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
