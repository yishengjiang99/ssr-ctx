
int main(int argc, char **argv)
{
	int socket_id;
	int client;
	socklen_t addrlen = sizeof(struct sockaddr_in);
	struct sockaddr_in this_addr;
	struct sockaddr_in peer_addr;
	unsigned short port = 5000; /* Port to listen on */

	// We've stack allocated this_addr and peer_addr, so zero them
	// (since we wouldn't know what was there otherwise).
	memset(&this_addr, 0, addrlen);
	memset(&peer_addr, 0, addrlen);
}