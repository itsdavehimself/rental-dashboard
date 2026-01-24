using AutoMapper;

public class CrewPresetProfile : Profile
{
    public CrewPresetProfile()
    {
        CreateMap<CrewPreset, CrewResponseDto>()
            .ForMember(dest => dest.TruckUid, opt => opt.MapFrom(src => 
                src.Truck != null ? src.Truck.Uid : Guid.Empty))
            
            .ForMember(dest => dest.LeadUid, opt => opt.MapFrom(src => 
                src.Crew.FirstOrDefault(u => u.Id == src.LeadId) != null 
                ? src.Crew.First(u => u.Id == src.LeadId).Uid 
                : Guid.Empty))

            .ForMember(dest => dest.Crew, opt => opt.MapFrom(src => 
                src.Crew != null ? src.Crew.Select(u => u.Uid).ToList() : new List<Guid>()));
    }
}