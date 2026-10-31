package com.peerlearn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PeerLearnApplication {
    public static void main(String[] args) {
        SpringApplication.run(PeerLearnApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  PEERLEARN - STUDENT SKILL EXCHANGE PLATFORM RUNNING AT PORT 8080");
        System.out.println("  Student Login : chintaassrija@gmail.com / student123");
        System.out.println("  Admin Portal  : admin@peerlearn.edu / Admin@123");
        System.out.println("  MySQL Database: peerlearn_db");
        System.out.println("==================================================================");
    }
}
