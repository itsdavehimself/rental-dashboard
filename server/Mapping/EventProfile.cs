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

    CreateMap<Discount, DiscountResponseDto>();

    CreateMap<Transaction, TransactionResponseDto>()
      .ForMember(dest => dest.ProcessedBy,
        opt => opt.MapFrom(src => src.ProcessedBy != null 
            ? $"{src.ProcessedBy.FirstName} {src.ProcessedBy.LastName}" 
            : "Unknown"))
       .ForMember(dest => dest.EventUid,
        opt => opt.MapFrom(src => src.Event.Uid));
  }
}