namespace PhotoLib.SystemCore.Libraries.Interfaces
{
    public interface IRepository<T> where T : class
    {
        public IReadOnlyCollection<T> Get();
        public T Get(Guid guid);
        public bool Add(T entity);
        public bool Update(T entity);
        public bool Delete(Guid guid);
        public bool Delete(T entity);
    }
}
