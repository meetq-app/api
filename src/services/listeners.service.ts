import express from 'express';
type stringOrNumber = string | number;

class serverListener {
    onListening(port: stringOrNumber ){
        return ()=>{
            console.log(`server is listening on ${port}`);
        }
    }

    onError(port: stringOrNumber){
        return (error:any)=>{
            if (error.syscall !== 'listen') {
                throw error;
            }

            switch (error.code) {
                case 'EACCES':
                    console.error(port + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(port + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
    }
}

export default new serverListener();
