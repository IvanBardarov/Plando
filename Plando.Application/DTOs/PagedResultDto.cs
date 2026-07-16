namespace Plando.Application.DTOs;

public class PagedResultDto<T>
{
    public IEnumerable<T> Items { get; init; } = [];
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public static int DefaultTotalCount => 0;
    public static int DefaultPage => 1;
    public static int DefaultPageSize => 10;

    private PagedResultDto(
        IEnumerable<T> items,
        int? totalCount,
        int? page,
        int? pageSize)
    {
        if (items is not null)
            Items = items;

        TotalCount = totalCount ?? DefaultTotalCount;
        Page = page ?? DefaultPage;
        PageSize = pageSize ?? DefaultPageSize;
    }

    public static PagedResultDto<T> FromEntities(
        IEnumerable<T> items,
        int? totalCount,
        int? page,
        int? pageSize)
    {
        return new PagedResultDto<T>(items, totalCount, page, pageSize);
    }
}