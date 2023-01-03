namespace Core.Entities
{
    public class CustomerBasket
    {
        // The empty constructor is necessary in order to make Redis work
        public CustomerBasket() {}

        public CustomerBasket(string id)
        {
            Id = id;
        }

        public string Id { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

    }
}