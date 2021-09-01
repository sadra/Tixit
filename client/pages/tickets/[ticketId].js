import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, erros } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => console.log(error),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {erros}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const { data } = await client.get(`api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
