#include <stdio.h>
#include <unistd.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>

#include <arpa/inet.h>
#include <errno.h>

#define HOST "192.168.1.11"
#define PORT 49160

int setup_connection(char *host, u_short port)
{
	int sockfd, errno;
	struct sockaddr_in servaddr;

	// socket create and varification
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd == -1) {
		printf("socket creation failed...\n");
		exit(0);
	}

	bzero(&servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = inet_addr(host);
    servaddr.sin_port = htons(port);

	// connect the client socket to server socket
	if (connect(sockfd, (struct sockaddr*)&servaddr, sizeof(servaddr)) != 0) {
		printf("connection with the server failed...\n");
        perror("Error ");
		return -1;

	} else{
		printf("connected to the server..\n");
	}

	return sockfd;
}


int main()
{
	int sockfd = setup_connection(HOST, PORT);

	if (sockfd == -1) exit(0);

	char buf[14];

	int I, Ta, Tc;
	float V;

	while(1)
	{
		I = rand()%10 + 40;
		V = ((float)rand() / (float)RAND_MAX) + 11;
		Ta = rand()%5 + 63;
		Tc = rand()%3 + 80;

		sprintf(buf, "%u,%.2f,%u,%u", I, V, Ta, Tc);
		write(sockfd, buf, sizeof(buf));

		sleep(1);
	}
	
	int len = write(sockfd,buf,1024);
	printf("wrote%d bytes from socket\n",len);
	close(sockfd);
}