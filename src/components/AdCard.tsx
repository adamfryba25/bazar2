type AdCardProps = {
  title: string;
  price: number;
  city: string;
  description: string;
  condition: string;
};

export default function AdCard({ title, price, city, description, condition }: AdCardProps) {
  return (
    <div className="border rounded - xl p-4 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-lg text-orange-600 font-bold">{price}Kč</p>
      <p className="text-sm text-gray-500">{city}</p>
      <p className="mt-2 text-sm">{description}</p>
      <p className="mt-2 text-sm font-medium">Stav: {condition}</p>
    </div>
  );
}
