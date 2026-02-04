using AutoMapper;
using server.Models.Event;

public class LogisticsProfile : Profile
{
    public LogisticsProfile()
    {
        CreateMap<Truck, TruckResponseDto>();

        CreateMap<Event, DeliveryDetailsDto>()
            .ForMember(dest => dest.AddressLine1, opt => opt.MapFrom(src => src.DeliveryAddressLine1))
            .ForMember(dest => dest.AddressLine2, opt => opt.MapFrom(src => src.DeliveryAddressLine2))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.DeliveryCity))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.DeliveryState))
            .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.DeliveryZipCode))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.DeliveryPhone))
            .ForMember(dest => dest.EventName, opt => opt.MapFrom(src => src.EventName))
            .ForMember(dest => dest.EventUid, opt => opt.MapFrom(src => src.Uid));

        CreateMap<LogisticsTrip, LogisticsTripResponseDto>()
            .ForMember(dest => dest.DeliveryDetails, 
                opt => opt.MapFrom(src => src.Event))
            
            .ForMember(dest => dest.TruckName,
                opt => opt.MapFrom(src => src.Truck != null ? src.Truck.Name : "No Truck"))
            .ForMember(dest => dest.TruckUid,
                opt => opt.MapFrom(src => src.Truck != null ? src.Truck.Uid : (Guid?)null));

        CreateMap<LogisticsWorkItem, LogisticsWorkItemResponseDto>();

        CreateMap<LogisticsAssignment, LogisticsAssignmentResponseDto>()
            .ForMember(dest => dest.FullName,
                opt => opt.MapFrom(src => src.User != null 
                    ? (src.User.FirstName + " " + src.User.LastName).Trim() 
                    : "Unassigned"))
            .ForMember(dest => dest.UserUid,
                opt => opt.MapFrom(src => src.User != null ? src.User.Uid : Guid.Empty));
    }
}