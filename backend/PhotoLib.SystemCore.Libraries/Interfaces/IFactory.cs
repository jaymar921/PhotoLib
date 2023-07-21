namespace PhotoLib.SystemCore.Libraries.Interfaces
{
    public interface IFactory<T> where T : class
    {
        public T Create();
    }
}
