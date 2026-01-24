using AutoMapper;

public class LogisticsProfile : Profile
{
    public LogisticsProfile()
    {
        CreateMap<Truck, TruckResponseDto>();

        CreateMap<LogisticsTrip, LogisticsTripResponseDto>()
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